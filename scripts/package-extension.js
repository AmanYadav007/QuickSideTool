// Zips extension/ into dist/extension/quick-side-tool-v<version>.zip for the
// Chrome Web Store, after checking the things the store rejects.
// Usage: npm run package:extension
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const source = path.join(root, "extension");
const manifest = JSON.parse(fs.readFileSync(path.join(source, "manifest.json"), "utf8"));

const problems = [];
if (manifest.manifest_version !== 3) problems.push("manifest_version must be 3");
if (manifest.update_url) problems.push("remove update_url: the store adds it itself");
if (!/^\d+(\.\d+){0,3}$/.test(manifest.version)) problems.push(`invalid version "${manifest.version}"`);
if ((manifest.name || "").length > 75) problems.push("name is longer than 75 characters");
if ((manifest.description || "").length > 132) problems.push("description is longer than 132 characters");
const referenced = [
  ...Object.values(manifest.icons || {}),
  ...Object.values(manifest.action?.default_icon || {}),
  manifest.background?.service_worker,
  manifest.side_panel?.default_path,
].filter(Boolean);
for (const file of referenced) {
  if (!fs.existsSync(path.join(source, file))) problems.push(`missing file: ${file}`);
}
for (const file of fs.readdirSync(source).filter((f) => f.endsWith(".html"))) {
  // Manifest V3 extension pages can't run inline scripts
  if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(fs.readFileSync(path.join(source, file), "utf8"))) {
    problems.push(`${file} has an inline <script>; move it to a .js file`);
  }
}
if (problems.length) {
  console.error("package-extension: not packaged:\n  - " + problems.join("\n  - "));
  process.exit(1);
}

const outDir = path.join(root, "dist", "extension");
const zip = path.join(outDir, `quick-side-tool-v${manifest.version}.zip`);
fs.mkdirSync(outDir, { recursive: true });
fs.rmSync(zip, { force: true });
// -X: no macOS extra attributes; skip hidden files like .DS_Store and docs
execFileSync("zip", ["-r", "-X", "-q", zip, ".", "-x", ".*", "-x", "*/.*", "-x", "*.md"], { cwd: source });
console.log(`package-extension: ${path.relative(root, zip)} (${Math.round(fs.statSync(zip).size / 1024)} KB)`);
