// Document-scanner image processing: find the page in a photo, straighten it,
// and clean it up for reading. Runs on plain pixel arrays so it needs no
// libraries; the canvas helpers at the bottom wrap it for the UI.

// Largest side kept for scanned pages - plenty for OCR and PDF export while
// keeping memory and processing time reasonable on phones.
export const MAX_SIDE = 2400;

// ---------- pixel helpers ----------

export const toGray = (rgba, width, height) => {
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0, p = 0; p < gray.length; i += 4, p++) {
    gray[p] = (rgba[i] * 77 + rgba[i + 1] * 150 + rgba[i + 2] * 29) >> 8;
  }
  return gray;
};

const boxBlur = (src, width, height, radius) => {
  // Separable box blur, one pass horizontal + one vertical
  const tmp = new Float32Array(width * height);
  const out = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    let sum = 0;
    const row = y * width;
    for (let x = -radius; x <= radius; x++)
      sum += src[row + Math.min(width - 1, Math.max(0, x))];
    for (let x = 0; x < width; x++) {
      tmp[row + x] = sum / (2 * radius + 1);
      sum +=
        src[row + Math.min(width - 1, x + radius + 1)] -
        src[row + Math.max(0, x - radius)];
    }
  }
  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let y = -radius; y <= radius; y++)
      sum += tmp[Math.min(height - 1, Math.max(0, y)) * width + x];
    for (let y = 0; y < height; y++) {
      out[y * width + x] = sum / (2 * radius + 1);
      sum +=
        tmp[Math.min(height - 1, y + radius + 1) * width + x] -
        tmp[Math.max(0, y - radius) * width + x];
    }
  }
  return out;
};

export const otsuThreshold = (values) => {
  const hist = new Float64Array(256);
  for (let i = 0; i < values.length; i++) hist[Math.round(values[i])]++;
  const total = values.length;
  let sumAll = 0;
  for (let t = 0; t < 256; t++) sumAll += t * hist[t];
  let sumBack = 0;
  let weightBack = 0;
  let best = 0;
  let threshold = 127;
  for (let t = 0; t < 256; t++) {
    weightBack += hist[t];
    if (!weightBack) continue;
    const weightFore = total - weightBack;
    if (!weightFore) break;
    sumBack += t * hist[t];
    const meanBack = sumBack / weightBack;
    const meanFore = (sumAll - sumBack) / weightFore;
    const between = weightBack * weightFore * (meanBack - meanFore) ** 2;
    if (between > best) {
      best = between;
      threshold = t;
    }
  }
  return threshold;
};

const polygonArea = (quad) => {
  let area = 0;
  for (let i = 0; i < quad.length; i++) {
    const a = quad[i];
    const b = quad[(i + 1) % quad.length];
    area += a.x * b.y - b.x * a.y;
  }
  return Math.abs(area) / 2;
};

const isConvex = (quad) => {
  let sign = 0;
  for (let i = 0; i < 4; i++) {
    const a = quad[i];
    const b = quad[(i + 1) % 4];
    const c = quad[(i + 2) % 4];
    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (cross === 0) return false;
    if (!sign) sign = Math.sign(cross);
    else if (Math.sign(cross) !== sign) return false;
  }
  return true;
};

// ---------- page detection ----------

/**
 * Find a sheet of paper in a photo: the largest bright region that stands out
 * from a darker background. Returns its four corners (top-left, top-right,
 * bottom-right, bottom-left) in the given image's pixel coordinates, or null
 * when there is no clear page (a screenshot, or a photo filled by the page).
 */
export const detectPageCorners = (gray, width, height) => {
  const blurred = boxBlur(gray, width, height, 2);
  const threshold = otsuThreshold(blurred);
  const size = width * height;

  // Bright pixels, then the largest connected bright region
  const labels = new Int32Array(size);
  const queue = new Int32Array(size);
  let bestLabel = 0;
  let bestArea = 0;
  let label = 0;
  for (let start = 0; start < size; start++) {
    if (labels[start] || blurred[start] <= threshold) continue;
    label++;
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    labels[start] = label;
    while (head < tail) {
      const p = queue[head++];
      const x = p % width;
      const neighbours = [
        x > 0 ? p - 1 : -1,
        x < width - 1 ? p + 1 : -1,
        p - width,
        p + width,
      ];
      for (const n of neighbours) {
        if (n >= 0 && n < size && !labels[n] && blurred[n] > threshold) {
          labels[n] = label;
          queue[tail++] = n;
        }
      }
    }
    if (tail > bestArea) {
      bestArea = tail;
      bestLabel = label;
    }
  }
  if (!bestLabel || bestArea < size * 0.1) return null;

  // Extreme points of the region give the corners of a roughly upright page
  let tl = null,
    tr = null,
    br = null,
    bl = null;
  let minX = width,
    maxX = 0,
    minY = height,
    maxY = 0;
  for (let p = 0; p < size; p++) {
    if (labels[p] !== bestLabel) continue;
    const x = p % width;
    const y = (p - x) / width;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (!tl || x + y < tl.x + tl.y) tl = { x, y };
    if (!br || x + y > br.x + br.y) br = { x, y };
    if (!tr || x - y > tr.x - tr.y) tr = { x, y };
    if (!bl || x - y < bl.x - bl.y) bl = { x, y };
  }

  // The region fills the frame: nothing to crop
  if (maxX - minX >= width * 0.97 && maxY - minY >= height * 0.97) return null;

  const quad = [tl, tr, br, bl];
  const quadArea = polygonArea(quad);
  if (!isConvex(quad) || quadArea < size * 0.15) return null;
  // Most of the quad should be the bright page (text makes some holes)
  if (bestArea / quadArea < 0.55) return null;

  // Pixel centres -> outer edges
  return [
    { x: tl.x, y: tl.y },
    { x: tr.x + 1, y: tr.y },
    { x: br.x + 1, y: br.y + 1 },
    { x: bl.x, y: bl.y + 1 },
  ];
};

// ---------- perspective correction ----------

// Solve the 8 unknowns of the homography that maps `from` points onto `to`.
const homography = (from, to) => {
  const A = [];
  const b = [];
  for (let i = 0; i < 4; i++) {
    const { x, y } = from[i];
    const { x: u, y: v } = to[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  // Gaussian elimination with partial pivoting
  for (let col = 0; col < 8; col++) {
    let pivot = col;
    for (let r = col + 1; r < 8; r++)
      if (Math.abs(A[r][col]) > Math.abs(A[pivot][col])) pivot = r;
    [A[col], A[pivot]] = [A[pivot], A[col]];
    [b[col], b[pivot]] = [b[pivot], b[col]];
    for (let r = col + 1; r < 8; r++) {
      const f = A[r][col] / A[col][col];
      for (let c = col; c < 8; c++) A[r][c] -= f * A[col][c];
      b[r] -= f * b[col];
    }
  }
  const h = new Array(8);
  for (let r = 7; r >= 0; r--) {
    let s = b[r];
    for (let c = r + 1; c < 8; c++) s -= A[r][c] * h[c];
    h[r] = s / A[r][r];
  }
  return h;
};

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** Output size for straightening `quad`: the page's own proportions. */
export const straightenedSize = (quad) => {
  const [tl, tr, br, bl] = quad;
  let w = Math.max(distance(tl, tr), distance(bl, br));
  let h = Math.max(distance(tl, bl), distance(tr, br));
  const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
  return {
    width: Math.max(1, Math.round(w * scale)),
    height: Math.max(1, Math.round(h * scale)),
  };
};

/** Map the quad's contents onto a flat rectangle (bilinear sampling). */
export const warpPerspective = (
  rgba,
  srcWidth,
  srcHeight,
  quad,
  width,
  height,
) => {
  const rect = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];
  const h = homography(rect, quad);
  const out = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    const cy = y + 0.5;
    for (let x = 0; x < width; x++) {
      const cx = x + 0.5;
      const d = h[6] * cx + h[7] * cy + 1;
      let sx = (h[0] * cx + h[1] * cy + h[2]) / d - 0.5;
      let sy = (h[3] * cx + h[4] * cy + h[5]) / d - 0.5;
      sx = Math.min(srcWidth - 1, Math.max(0, sx));
      sy = Math.min(srcHeight - 1, Math.max(0, sy));
      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      const x1 = Math.min(srcWidth - 1, x0 + 1);
      const y1 = Math.min(srcHeight - 1, y0 + 1);
      const fx = sx - x0;
      const fy = sy - y0;
      const i00 = (y0 * srcWidth + x0) * 4;
      const i10 = (y0 * srcWidth + x1) * 4;
      const i01 = (y1 * srcWidth + x0) * 4;
      const i11 = (y1 * srcWidth + x1) * 4;
      const o = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) {
        const top = rgba[i00 + c] + (rgba[i10 + c] - rgba[i00 + c]) * fx;
        const bottom = rgba[i01 + c] + (rgba[i11 + c] - rgba[i01 + c]) * fx;
        out[o + c] = top + (bottom - top) * fy;
      }
      out[o + 3] = 255;
    }
  }
  return out;
};

// ---------- clean-up filters ----------

/**
 * "Scan" look: estimate the paper's brightness everywhere (shadows, uneven
 * light), divide it out so the page becomes evenly white, then deepen the ink.
 * Returns grayscale values.
 */
export const flattenLighting = (gray, width, height) => {
  // Paper brightness per cell: the brightest pixels in a cell are paper, not ink
  const cell = Math.max(8, Math.round(Math.max(width, height) / 60));
  const gw = Math.ceil(width / cell);
  const gh = Math.ceil(height / cell);
  const grid = new Float32Array(gw * gh);
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      let max = 0;
      const yEnd = Math.min(height, (gy + 1) * cell);
      const xEnd = Math.min(width, (gx + 1) * cell);
      for (let y = gy * cell; y < yEnd; y += 2) {
        for (let x = gx * cell; x < xEnd; x += 2) {
          const v = gray[y * width + x];
          if (v > max) max = v;
        }
      }
      grid[gy * gw + gx] = max;
    }
  }
  const background = boxBlur(boxBlur(grid, gw, gh, 1), gw, gh, 1);

  const out = new Uint8ClampedArray(width * height);
  for (let y = 0; y < height; y++) {
    const gyf = Math.min(gh - 1, Math.max(0, y / cell - 0.5));
    const gy0 = Math.floor(gyf);
    const gy1 = Math.min(gh - 1, gy0 + 1);
    const fy = gyf - gy0;
    for (let x = 0; x < width; x++) {
      const gxf = Math.min(gw - 1, Math.max(0, x / cell - 0.5));
      const gx0 = Math.floor(gxf);
      const gx1 = Math.min(gw - 1, gx0 + 1);
      const fx = gxf - gx0;
      const top =
        background[gy0 * gw + gx0] * (1 - fx) + background[gy0 * gw + gx1] * fx;
      const bottom =
        background[gy1 * gw + gx0] * (1 - fx) + background[gy1 * gw + gx1] * fx;
      const paper = Math.max(1, top * (1 - fy) + bottom * fy);
      // 1 = paper, lower = ink. Push near-paper to white, darken the ink.
      const ratio = gray[y * width + x] / paper;
      const level = Math.min(1, Math.max(0, (ratio - 0.35) / 0.55));
      out[y * width + x] = 255 * level ** 1.6;
    }
  }
  return out;
};

export const binarize = (gray) => {
  const threshold = otsuThreshold(gray);
  const out = new Uint8ClampedArray(gray.length);
  for (let i = 0; i < gray.length; i++) out[i] = gray[i] > threshold ? 255 : 0;
  return out;
};

// ---------- canvas helpers ----------

const makeCanvas = (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const pixels = (canvas) =>
  canvas
    .getContext("2d", { willReadFrequently: true })
    .getImageData(0, 0, canvas.width, canvas.height).data;

const canvasFromGray = (gray, width, height) => {
  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(width, height);
  for (let p = 0, i = 0; p < gray.length; p++, i += 4) {
    image.data[i] = image.data[i + 1] = image.data[i + 2] = gray[p];
    image.data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
};

/** Decode an image file (honouring camera rotation) into a canvas, capped at MAX_SIDE. */
export const fileToCanvas = async (file) => {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = makeCanvas(
    Math.round(bitmap.width * scale),
    Math.round(bitmap.height * scale),
  );
  const ctx = canvas.getContext("2d");
  // Transparent PNGs (screenshots) read better on white than on black
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return canvas;
};

/** Detect the page on a small copy of the canvas; corners come back in full-size coordinates. */
export const detectPage = (canvas) => {
  const scale = Math.min(1, 320 / Math.max(canvas.width, canvas.height));
  const small = makeCanvas(
    Math.max(1, Math.round(canvas.width * scale)),
    Math.max(1, Math.round(canvas.height * scale)),
  );
  small.getContext("2d").drawImage(canvas, 0, 0, small.width, small.height);
  const corners = detectPageCorners(
    toGray(pixels(small), small.width, small.height),
    small.width,
    small.height,
  );
  if (!corners) return null;
  const sx = canvas.width / small.width;
  const sy = canvas.height / small.height;
  // Detection works on a small copy, so edges can be a few pixels off. Pull the
  // corners slightly towards the centre so no sliver of desk ends up in the scan.
  const cx = corners.reduce((s, c) => s + c.x, 0) / 4;
  const cy = corners.reduce((s, c) => s + c.y, 0) / 4;
  return corners.map(({ x, y }) => ({
    x: (x + (cx - x) * 0.012) * sx,
    y: (y + (cy - y) * 0.012) * sy,
  }));
};

export const fullImageQuad = (canvas) => [
  { x: 0, y: 0 },
  { x: canvas.width, y: 0 },
  { x: canvas.width, y: canvas.height },
  { x: 0, y: canvas.height },
];

/** Rotate a canvas a quarter turn clockwise, returning the new canvas. */
export const rotateCanvas = (canvas) => {
  const out = makeCanvas(canvas.height, canvas.width);
  const ctx = out.getContext("2d");
  ctx.translate(out.width, 0);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(canvas, 0, 0);
  return out;
};

/** Where a point lands after rotateCanvas (clockwise quarter turn). */
export const rotatePoint = ({ x, y }, sourceHeight) => ({
  x: sourceHeight - y,
  y: x,
});

/**
 * The full scan pipeline: straighten the page inside `quad` (skipped when the
 * quad is the whole image), then apply the filter ("scan", "bw" or "original").
 */
export const renderScan = (source, quad, filter) => {
  const isFullImage =
    !quad ||
    quad.every((p, i) => {
      const full = fullImageQuad(source)[i];
      return Math.abs(p.x - full.x) < 1 && Math.abs(p.y - full.y) < 1;
    });

  let width = source.width;
  let height = source.height;
  let rgba = pixels(source);
  if (!isFullImage) {
    ({ width, height } = straightenedSize(quad));
    rgba = warpPerspective(
      rgba,
      source.width,
      source.height,
      quad,
      width,
      height,
    );
  }

  if (filter === "original") {
    if (isFullImage) {
      const copy = makeCanvas(width, height);
      copy.getContext("2d").drawImage(source, 0, 0);
      return copy;
    }
    const canvas = makeCanvas(width, height);
    canvas
      .getContext("2d")
      .putImageData(new ImageData(rgba, width, height), 0, 0);
    return canvas;
  }

  const flat = flattenLighting(toGray(rgba, width, height), width, height);
  return canvasFromGray(filter === "bw" ? binarize(flat) : flat, width, height);
};
