/* eslint-disable no-restricted-globals */
/* global pdfjsLib */
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';
// src/workers/pdfProcessor.worker.js

// Message handler
self.onmessage = async function(e) {
  const { files } = e.data;
  const results = [];
  for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
    const file = files[fileIndex];
    if (file.type === 'application/pdf') {
      // Use pdfjs to extract pages
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = new OffscreenCanvas(viewport.width, viewport.height);
        const context = canvas.getContext('2d');
        await page.render({ canvasContext: context, viewport }).promise;
        const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 });
        results.push({
          type: 'pdf',
          pageIndex: i,
          preview: blob,
          dimensions: { width: viewport.width, height: viewport.height },
          rotation: 0,
        });
        self.postMessage({ progress: ((fileIndex + i / pdf.numPages) / files.length) * 100 });
      }
    } else if (file.type.startsWith('image/')) {
      results.push({
        type: 'image',
        pageIndex: 0,
        preview: file,
        dimensions: { width: 0, height: 0 },
        rotation: 0,
      });
      self.postMessage({ progress: ((fileIndex + 1) / files.length) * 100 });
    }
  }
  self.postMessage({ done: true, results });
}; 