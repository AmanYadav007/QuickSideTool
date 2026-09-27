// Runs PDF jobs on the device via public/workers/pdf-worker.js (MuPDF in
// WebAssembly). Jobs: "unlock", "lock", "removeLinks" - see pdf-ops.js.
//
// Errors carry a `code`. "engine-unavailable" means the device can't run the
// engine (very old browser, blocked download); callers then use the server.

const WORKER_URL = `${process.env.PUBLIC_URL}/workers/pdf-worker.js`;
const START_TIMEOUT = 45000; // the engine is ~3.5 MB on first use

let worker = null;
let ready = null;
let nextId = 1;
const pending = new Map();

const unavailable = (message) =>
  Object.assign(
    new Error(message || "The PDF engine couldn't start on this device."),
    {
      code: "engine-unavailable",
    },
  );

const reset = (error) => {
  pending.forEach(({ reject }) => reject(error));
  pending.clear();
  worker?.terminate();
  worker = null;
  ready = null;
};

const start = () => {
  if (ready) return ready;
  ready = new Promise((resolve, reject) => {
    try {
      worker = new Worker(WORKER_URL, { type: "module" });
    } catch (error) {
      ready = null;
      reject(unavailable(error.message));
      return;
    }
    const timer = setTimeout(() => {
      const error = unavailable("The PDF engine took too long to load.");
      reject(error);
      reset(error);
    }, START_TIMEOUT);

    worker.onmessage = ({ data }) => {
      if (data.ready) {
        clearTimeout(timer);
        resolve();
        return;
      }
      const job = pending.get(data.id);
      if (!job) return;
      pending.delete(data.id);
      if (data.error)
        job.reject(
          Object.assign(new Error(data.error.message), {
            code: data.error.code,
          }),
        );
      else job.resolve(data.result);
    };
    worker.onerror = (event) => {
      event.preventDefault?.();
      clearTimeout(timer);
      const error = unavailable(event.message);
      reject(error);
      reset(error);
    };
  });
  return ready;
};

/** Start downloading the engine early, e.g. when a tool page opens. */
export const preloadPdfEngine = () => {
  if (navigator.connection?.saveData) return;
  start().catch(() => {});
};

/** Run a job on a File; resolves to { bytes, ...details }. */
export const runPdfJob = async (job, file, password) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  await start();
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    worker.postMessage({ id, job, bytes, password }, [bytes.buffer]);
  });
};
