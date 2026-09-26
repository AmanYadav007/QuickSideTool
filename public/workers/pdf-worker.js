// Module worker: runs the jobs in pdf-ops.js off the main thread, so large
// PDFs don't freeze the page. See src/utils/pdfWorker.js for the caller.
import * as ops from "./pdf-ops.js";

self.postMessage({ ready: true });

self.onmessage = ({ data: { id, job, bytes, password } }) => {
  try {
    const result = ops[job](bytes, password);
    self.postMessage({ id, result }, [result.bytes.buffer]);
  } catch (error) {
    self.postMessage({
      id,
      error: { code: error.code || "failed", message: error.message || "Something went wrong." },
    });
  }
};
