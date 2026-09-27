// PDF jobs that run on the user's device with MuPDF (WebAssembly): the file
// and any password never leave the browser. Used by pdf-worker.js; plain
// ES module so it runs in a module worker and in Node for tests.
import * as mupdf from "../vendor/mupdf/mupdf.js";

export class JobError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const open = (bytes) => {
  let doc;
  try {
    doc = mupdf.Document.openDocument(bytes, "application/pdf");
  } catch {
    throw new JobError("invalid", "This file isn't a valid PDF or is damaged.");
  }
  const pdf = doc.asPDF();
  if (!pdf) {
    doc.destroy();
    throw new JobError("invalid", "This file isn't a valid PDF or is damaged.");
  }
  return pdf;
};

const save = (pdf, options) => {
  const buffer = pdf.saveToBuffer(options);
  const bytes = buffer.asUint8Array().slice(); // copy out of WebAssembly memory
  buffer.destroy();
  return bytes;
};

const isEncrypted = (pdf) => (pdf.getMetaData("encryption") || "None") !== "None";

/** Remove the password and any restrictions (printing, copying). */
export function unlock(bytes, password) {
  const pdf = open(bytes);
  try {
    if (pdf.needsPassword()) {
      if (!password) {
        throw new JobError("password-required", "Enter the PDF's password to unlock it.");
      }
      if (!pdf.authenticatePassword(password)) {
        throw new JobError("wrong-password", "Incorrect password for this PDF.");
      }
    } else if (!isEncrypted(pdf)) {
      throw new JobError("not-locked", "This PDF isn't password-protected, so there's nothing to unlock.");
    }
    return { bytes: save(pdf, "encrypt=none,garbage") };
  } finally {
    pdf.destroy();
  }
}

/** Add AES-256 encryption; the password is needed to open the file. */
export function lock(bytes, password) {
  // MuPDF reads options as a comma-separated list, so a comma would cut the
  // password short. The caller sends those to the server instead.
  if (!password || password.includes(",")) {
    throw new JobError("unsupported-password", "This password can't be applied on the device.");
  }
  const pdf = open(bytes);
  try {
    if (pdf.needsPassword()) {
      throw new JobError("already-locked", "This PDF already has a password. Unlock it first.");
    }
    const options = [
      "encrypt=aes-256",
      `user-password=${password}`,
      `owner-password=${password}`,
      "garbage",
    ].join(",");
    return { bytes: save(pdf, options) };
  } finally {
    pdf.destroy();
  }
}

const name = (obj) => (obj.isName() ? obj.asName() : "");

/**
 * Remove every link annotation (web, email, and jumps within the document),
 * and web/launch actions from other annotations. Comments, form fields and
 * bookmarks are kept.
 */
export function removeLinks(bytes) {
  const pdf = open(bytes);
  try {
    if (pdf.needsPassword()) {
      throw new JobError("password-required", "This PDF is password-protected. Unlock it first, then try again.");
    }
    let removed = 0;
    let pagesWithLinks = 0;
    const pageCount = pdf.countPages();
    for (let i = 0; i < pageCount; i++) {
      const page = pdf.findPage(i);
      const annots = page.get("Annots");
      if (!annots.isArray()) continue;

      const kept = pdf.newArray();
      let removedHere = 0;
      annots.forEach((ref) => {
        const annot = ref.resolve();
        if (name(annot.get("Subtype")) === "Link") {
          removedHere++;
          return;
        }
        const action = annot.get("A");
        if (action.isDictionary() && ["URI", "Launch"].includes(name(action.get("S")))) {
          annot.delete("A");
          removedHere++;
        }
        kept.push(ref);
      });

      if (removedHere) {
        pagesWithLinks++;
        removed += removedHere;
        if (kept.length) page.put("Annots", kept);
        else page.delete("Annots");
      }
    }
    if (!removed) {
      throw new JobError("no-links", "This PDF has no links to remove.");
    }
    // garbage: drop the removed link objects so their URLs aren't left in the file
    return { bytes: save(pdf, "garbage,compress"), removed, pages: pagesWithLinks, pageCount };
  } finally {
    pdf.destroy();
  }
}
