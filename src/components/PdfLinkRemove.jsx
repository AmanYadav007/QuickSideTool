import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { PDFDocument } from 'pdf-lib';

const PdfLinkRemove = () => {
  const [file, setFile] = useState(null);
  const [modifiedPdf, setModifiedPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set up the PDF.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
      setFile(null);
    }
  };

  // Remove links from the PDF
  const handleRemoveLinks = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Read the uploaded PDF file
      const arrayBuffer = await file.arrayBuffer();

      // Load the PDF document using pdf-lib
      const pdfLibDoc = await PDFDocument.load(arrayBuffer);

      // Load the PDF document using pdfjs-dist
      const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

      // Iterate through each page
      for (let i = 0; i < pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i + 1);
        const annotations = await page.getAnnotations();

        // Filter out link annotations
        const linkAnnotations = annotations.filter(
          (annotation) => annotation.subtype === 'Link'
        );

        // Remove link annotations from the page
        if (linkAnnotations.length > 0) {
          const pdfLibPage = pdfLibDoc.getPage(i);
          pdfLibPage.node.removeAnnots();
        }
      }

      // Save the modified PDF
      const modifiedPdfBytes = await pdfLibDoc.save();
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

      // Set the modified PDF for download
      setModifiedPdf(modifiedPdfBlob);
    } catch (err) {
      setError('Failed to process the PDF. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Download the modified PDF
  const handleDownload = () => {
    if (modifiedPdf) {
      const url = URL.createObjectURL(modifiedPdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'modified-pdf.pdf';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 w-full max-w-2xl text-center border border-white border-opacity-20">
        <h1 className="text-3xl font-bold text-white mb-4">PDF Link Remover</h1>
        <p className="text-white text-opacity-80 mb-6">
          Upload a PDF file to remove links and download the modified version.
        </p>

        {/* File Upload */}
        <div className="mb-6">
          <label className="cursor-pointer bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-all duration-300">
            <FileText size={20} className="inline-block mr-2" />
            {file ? file.name : 'Choose PDF File'}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-300 mb-4">{error}</p>}

        {/* Remove Links Button */}
        <button
          onClick={handleRemoveLinks}
          disabled={!file || loading}
          className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Remove Links'}
        </button>

        {/* Download Button */}
        {modifiedPdf && (
          <button
            onClick={handleDownload}
            className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center mx-auto"
          >
            <Download size={20} className="inline-block mr-2" />
            Download Modified PDF
          </button>
        )}

        {/* Back to Home */}
        <Link
          to="/"
          className="mt-6 inline-block text-white text-opacity-80 hover:text-opacity-100 transition-all duration-300"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PdfLinkRemove;