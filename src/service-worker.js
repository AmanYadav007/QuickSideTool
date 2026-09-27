/* eslint-disable no-restricted-globals */
// Offline cache for the website, including inside the extension's side panel.
// Built by Create React App with Workbox; registered in src/index.js.
//
// - App shell (main bundle, CSS, fonts) is precached: repeat visits start
//   instantly and the browser-only tools work offline.
// - Each tool's bundle is cached the first time it's used (hashed, never changes).
// - Engines in /vendor and /workers (MuPDF, Tesseract, pdf.js) are cached on
//   first use and refreshed in the background. (Tesseract keeps its language
//   data in IndexedDB itself.)
// - Pages always try the network first so a new deploy shows up right away;
//   offline, any page falls back to the cached app shell.
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  matchPrecache,
} from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";

self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();

// Precached on first visit: main bundle, CSS, index.html (offline fallback) and
// the Latin WOFF2 fonts. Tool bundles and other font subsets/formats are cached
// by the routes below when first used, so a first visit stays small.
const precached = self.__WB_MANIFEST.filter(
  ({ url }) =>
    !/\.chunk\.js$/.test(url) &&
    !(
      /\/static\/media\/.+\.woff2?$/.test(url) &&
      !/-latin-\d+-normal\.[^.]+\.woff2$/.test(url)
    ),
);
// directoryIndex: null stops the precached index.html answering "/" ahead of
// the network-first page route
precacheAndRoute(precached, { directoryIndex: null });

const ok = new CacheableResponsePlugin({ statuses: [0, 200] });

// Pages: network first (fresh after deploys), cached copy when offline or slow
registerRoute(
  new NavigationRoute(
    new NetworkFirst({
      cacheName: "pages",
      networkTimeoutSeconds: 3,
      plugins: [
        ok,
        new ExpirationPlugin({ maxEntries: 30 }),
        // Offline and never visited: every route is the same single-page app
        { handlerDidError: () => matchPrecache("/index.html") },
      ],
    }),
  ),
);

// Tool bundles: hashed file names, so a cached copy is always correct
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    /\/static\/js\/.+\.chunk\.js$/.test(url.pathname),
  new CacheFirst({
    cacheName: "tool-bundles",
    plugins: [
      ok,
      new ExpirationPlugin({
        maxEntries: 80,
        maxAgeSeconds: 60 * 60 * 24 * 60,
      }),
    ],
  }),
);

// Fonts outside the precache (other scripts, older formats), when a page uses them
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    url.pathname.startsWith("/static/media/"),
  new CacheFirst({
    cacheName: "fonts",
    plugins: [ok, new ExpirationPlugin({ maxEntries: 30 })],
  }),
);

// Engines (MuPDF ~10 MB, Tesseract, pdf.js worker): not hashed, so serve the
// cached copy and refresh it in the background
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    /^\/(vendor|workers)\//.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: "engines",
    plugins: [ok, new ExpirationPlugin({ maxEntries: 20 })],
  }),
);
