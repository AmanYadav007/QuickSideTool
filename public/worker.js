// Web Worker for heavy file processing operations
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'COMPRESS_IMAGE':
      compressImage(data);
      break;
    case 'PROCESS_PDF':
      processPDF(data);
      break;
    case 'GENERATE_QR':
      generateQR(data);
      break;
    case 'BATCH_PROCESS':
      batchProcess(data);
      break;
    default:
      self.postMessage({ type: 'ERROR', error: 'Unknown operation type' });
  }
};

// Image compression using Canvas API
function compressImage(data) {
  const { file, quality, maxWidth, maxHeight } = data;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions
      let { width, height } = img;
      if (maxWidth && width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (maxHeight && height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          self.postMessage({
            type: 'COMPRESS_IMAGE_SUCCESS',
            result: {
              blob,
              originalSize: file.size,
              compressedSize: blob.size,
              compressionRatio: ((file.size - blob.size) / file.size * 100).toFixed(1)
            }
          });
        },
        'image/jpeg',
        quality / 100
      );
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// PDF processing operations
function processPDF(data) {
  const { operation, file, options } = data;
  
  // Simulate PDF processing
  setTimeout(() => {
    self.postMessage({
      type: 'PROCESS_PDF_SUCCESS',
      result: {
        operation,
        processed: true,
        message: `${operation} completed successfully`
      }
    });
  }, 1000);
}

// QR Code generation
function generateQR(data) {
  const { text, size, color } = data;
  
  // Simulate QR generation
  setTimeout(() => {
    self.postMessage({
      type: 'GENERATE_QR_SUCCESS',
      result: {
        qrData: text,
        size,
        color
      }
    });
  }, 500);
}

// Batch processing for multiple files
function batchProcess(data) {
  const { files, operation, options } = data;
  const results = [];
  let completed = 0;
  
  files.forEach((file, index) => {
    setTimeout(() => {
      // Simulate processing each file
      results[index] = {
        fileName: file.name,
        status: 'completed',
        processed: true
      };
      
      completed++;
      
      // Send progress update
      self.postMessage({
        type: 'BATCH_PROGRESS',
        progress: (completed / files.length) * 100,
        completed,
        total: files.length
      });
      
      // Send final result when all files are processed
      if (completed === files.length) {
        self.postMessage({
          type: 'BATCH_PROCESS_SUCCESS',
          results
        });
      }
    }, index * 200); // Stagger processing
  });
}

// Error handling
self.onerror = function(error) {
  self.postMessage({
    type: 'ERROR',
    error: error.message
  });
}; 