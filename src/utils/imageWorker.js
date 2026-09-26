// Image compression in a small pool of workers (public/workers/image-worker.js)
// so large batches don't freeze the page. Errors carry a `code`;
// "engine-unavailable" means this browser can't run it (Safari < 16.4) and the
// caller should use its in-page fallback.

const WORKER_URL = `${process.env.PUBLIC_URL}/workers/image-worker.js`;
const POOL_SIZE = Math.min(4, Math.max(1, Math.floor((navigator.hardwareConcurrency || 2) / 2)));

export const workerSupported =
  typeof Worker !== "undefined" &&
  typeof OffscreenCanvas !== "undefined" &&
  typeof createImageBitmap !== "undefined";

let pool = null;
let nextId = 1;

const unavailable = (message) =>
  Object.assign(new Error(message || "Image compression isn't supported in this browser."), {
    code: "engine-unavailable",
  });

const spawn = () => {
  const slot = { busy: 0, pending: new Map() };
  slot.ready = new Promise((resolve, reject) => {
    try {
      slot.worker = new Worker(WORKER_URL, { type: "module" });
    } catch (error) {
      reject(unavailable(error.message));
      return;
    }
    slot.worker.onmessage = ({ data }) => {
      if (data.ready) {
        resolve();
        return;
      }
      const job = slot.pending.get(data.id);
      if (!job) return;
      slot.pending.delete(data.id);
      slot.busy--;
      if (data.error) job.reject(Object.assign(new Error(data.error.message), { code: data.error.code }));
      else job.resolve(data.result);
    };
    slot.worker.onerror = (event) => {
      event.preventDefault?.();
      const error = unavailable(event.message);
      reject(error);
      slot.pending.forEach(({ reject: fail }) => fail(error));
      slot.pending.clear();
      slot.worker.terminate();
      pool = null; // start fresh next time
    };
  });
  return slot;
};

/**
 * Compress one image. options: { type: "image/jpeg" | "image/webp" | "image/png",
 * quality: 0-1, targetBytes? }. Resolves to { blob, width, height, quality,
 * fits?, scaled?, unchanged? }.
 */
export const compressImage = async (file, options) => {
  if (!workerSupported) throw unavailable();
  if (!pool) pool = Array.from({ length: POOL_SIZE }, spawn);
  const slot = pool.reduce((a, b) => (b.busy < a.busy ? b : a));
  slot.busy++;
  try {
    await slot.ready;
  } catch (error) {
    slot.busy--;
    throw error;
  }
  return new Promise((resolve, reject) => {
    const id = nextId++;
    slot.pending.set(id, { resolve, reject });
    slot.worker.postMessage({ id, payload: { file, ...options } });
  });
};
