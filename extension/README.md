# Quick Side Tool: Chrome extension

The side panel shows the website (`https://www.ilovetools.website`) in a
frame, so every website deploy reaches extension users right away with no
store review. A new package is only needed when something in this folder
changes.

| File | What it does |
|---|---|
| `manifest.json` | Name, version, the `sidePanel` permission |
| `background.js` | Makes the toolbar icon open the side panel |
| `sidepanel.html` / `sidepanel.js` | The frame, plus loading, slow and offline messages |

The site is loaded with `?source=extension`, and `src/utils/appContext.js`
remembers it for the visit: the site hides its own "Add to Chrome" buttons
and posts a "ready" message the panel waits for when offline.

## Try it locally

`chrome://extensions` → Developer mode → Load unpacked → pick this folder.
To point it at a local build, change `APP_URL` in `sidepanel.js` (don't
commit that).

## Release a new version

1. Raise `version` in `manifest.json`; the store needs it higher than the
   published one.
2. `npm run package:extension` writes `dist/extension/quick-side-tool-v<version>.zip`
   (after checking the manifest).
3. Chrome Web Store Developer Dashboard → the item → Package → Upload new
   package → Submit for review.
