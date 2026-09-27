// Image compression off the main thread (module worker). Uses the browser's
// own JPEG/WebP encoders (fast, and within ~1% of the best WebP encoder in
// our tests), OxiPNG for lossless PNG, and jSquash's WebP encoder only where
// the browser can't encode WebP (Safari). See src/utils/imageWorker.js.

let oxipng;
let webpEncode;
const loadOxipng = async () =>
  (oxipng ??= (await import("../vendor/jsquash/oxipng/optimise.js")).default);
const loadWebp = async () =>
  (webpEncode ??= (await import("../vendor/jsquash/webp/encode.js")).default);

let nativeWebp;
const hasNativeWebp = async () => {
  if (nativeWebp === undefined) {
    const probe = new OffscreenCanvas(1, 1);
    probe.getContext("2d"); // a canvas can't encode until it has a context
    const blob = await probe.convertToBlob({ type: "image/webp" });
    nativeWebp = blob.type === "image/webp";
  }
  return nativeWebp;
};

const draw = (bitmap, width, height, background) => {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  // JPEG has no transparency: without a background, clear pixels turn black
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  return canvas;
};

const encode = async (canvas, type, quality) => {
  if (type === "image/webp" && !(await hasNativeWebp())) {
    const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    const bytes = await (await loadWebp())(data, { quality: Math.round(quality * 100) });
    return new Blob([bytes], { type: "image/webp" });
  }
  return canvas.convertToBlob({ type, quality });
};

// Lossless: OxiPNG on the original bytes when it's already a PNG
async function toPng(file, bitmap) {
  const optimise = await loadOxipng();
  const input =
    file.type === "image/png"
      ? await file.arrayBuffer()
      : await (await draw(bitmap, bitmap.width, bitmap.height).convertToBlob({ type: "image/png" })).arrayBuffer();
  return new Blob([await optimise(input, { level: 2 })], { type: "image/png" });
}

// Target size: the best-looking file that fits. Quality stays at 40% or above
// and the image is scaled down instead (a slightly smaller picture looks far
// better than a blocky one); below 256 px on the short side, quality may drop.
const QUALITY_FLOOR = 0.4;
const MIN_SIDE = 256;

async function toTarget(bitmap, type, targetBytes, background) {
  let scale = 1;
  let smallest = null;
  for (let attempt = 0; attempt < 10; attempt++) {
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = draw(bitmap, width, height, background);
    const tiny = Math.min(width, height) <= MIN_SIDE;
    let low = tiny ? 0.05 : QUALITY_FLOOR;
    let high = 0.95;
    const floor = await encode(canvas, type, low);
    if (!smallest || floor.size < smallest.blob.size) smallest = { blob: floor, quality: low, width, height };
    if (floor.size > targetBytes) {
      scale *= Math.min(0.9, Math.sqrt(targetBytes / floor.size) * 0.97);
      continue;
    }
    let best = { blob: floor, quality: low, width, height };
    for (let step = 0; step < 7; step++) {
      const mid = (low + high) / 2;
      const blob = await encode(canvas, type, mid);
      if (blob.size <= targetBytes) {
        best = { blob, quality: mid, width, height };
        low = mid;
      } else {
        high = mid;
      }
    }
    return { ...best, fits: true, scaled: scale < 1 };
  }
  return { ...smallest, fits: false, scaled: true };
}

async function compress({ file, type, quality, targetBytes }) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw Object.assign(new Error("Couldn't read this image. Try a JPG, PNG or WebP file."), { code: "decode" });
  }
  try {
    const original = { width: bitmap.width, height: bitmap.height };
    if (type === "image/png") {
      const blob = await toPng(file, bitmap);
      if (file.type === "image/png" && blob.size >= file.size) return { blob: file, ...original, unchanged: true };
      return { blob, ...original };
    }
    const background = type === "image/jpeg" ? "#ffffff" : null;
    // await: the finally below must not release the bitmap while this runs
    if (targetBytes) return await toTarget(bitmap, type, targetBytes, background);

    const blob = await encode(draw(bitmap, bitmap.width, bitmap.height, background), type, quality);
    // Re-encoding an already-small file can make it bigger: keep the original then
    if (file.type === type && blob.size >= file.size) return { blob: file, ...original, quality, unchanged: true };
    return { blob, ...original, quality };
  } finally {
    bitmap.close();
  }
}

self.postMessage({ ready: true });

self.onmessage = async ({ data: { id, payload } }) => {
  try {
    self.postMessage({ id, result: await compress(payload) });
  } catch (error) {
    self.postMessage({ id, error: { code: error.code || "failed", message: error.message || "Compression failed." } });
  }
};
