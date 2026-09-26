import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import GTMBody from "./components/GTMBody";
import ScrollToTop from "./components/ScrollToTop";
import PageLoading from "./components/PageLoading";
import LandingPage from "./pages/LandingPage";
import { pages } from "./pageLoaders";

import "./index.css";

const {
  pdfCompressor: PDFCompressor,
  fileConverter: FileConverter,
  pdfTool: PDFTool,
  pdfUnlocker: PDFUnlocker,
  pdfLinkRemover: PDFLinkRemover,
  ocr: OCRProcessor,
  imageResize: ImageResize,
  imageCompressor: ImageCompressor,
  imageConverter: ImageFormatConverter,
  qr: QrCodeGenerator,
  toolkit: Toolkit,
  about: About,
  contact: Contact,
  help: Help,
  blog: Blog,
  privacy: PrivacyPolicy,
  terms: TermsOfService,
  game: DiamondQuestGame,
} = pages;

function App() {
  return (
    <HelmetProvider>
      {/* Ads disabled */}
      <GTMBody />
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/toolkit" element={<Toolkit />} />
                <Route path="/pdf-tool" element={<PDFTool />} />
                {/* Keyword-friendly aliases */}
                <Route path="/pdf-editor" element={<PDFTool />} />
                {/* The image toolkit page was folded into the home page's Image Tools section */}
                <Route
                  path="/image-tools"
                  element={<Navigate to="/home#image-tools" replace />}
                />
                <Route path="/image-tools/resize" element={<ImageResize />} />
                <Route path="/image-resizer" element={<ImageResize />} />
                <Route
                  path="/image-tools/compress"
                  element={<ImageCompressor />}
                />
                <Route path="/image-compressor" element={<ImageCompressor />} />
                <Route
                  path="/image-tools/convert"
                  element={<ImageFormatConverter />}
                />
                <Route
                  path="/image-converter"
                  element={<ImageFormatConverter />}
                />
                <Route path="/qr-tool" element={<QrCodeGenerator />} />
                <Route
                  path="/qr-code-generator"
                  element={<QrCodeGenerator />}
                />
                <Route path="/unlock-pdf" element={<PDFUnlocker />} />
                <Route path="/remove-pdf-password" element={<PDFUnlocker />} />
                <Route path="/pdf-link-remove" element={<PDFLinkRemover />} />
                <Route
                  path="/remove-links-from-pdf"
                  element={<PDFLinkRemover />}
                />
                {/* One converter; each keyword URL opens it on its conversion */}
                <Route path="/file-converter" element={<FileConverter />} />
                <Route
                  path="/pdf-to-word"
                  element={
                    <FileConverter
                      key="pdf-to-word"
                      initialMode="pdf-to-word"
                    />
                  }
                />
                <Route
                  path="/pdf-to-docx"
                  element={
                    <FileConverter
                      key="pdf-to-word"
                      initialMode="pdf-to-word"
                    />
                  }
                />
                <Route
                  path="/word-to-pdf"
                  element={
                    <FileConverter
                      key="word-to-pdf"
                      initialMode="word-to-pdf"
                    />
                  }
                />
                <Route
                  path="/docx-to-pdf"
                  element={
                    <FileConverter
                      key="word-to-pdf"
                      initialMode="word-to-pdf"
                    />
                  }
                />
                <Route
                  path="/word-to-excel"
                  element={
                    <FileConverter
                      key="word-to-excel"
                      initialMode="word-to-excel"
                    />
                  }
                />
                <Route
                  path="/pdf-to-excel"
                  element={
                    <FileConverter
                      key="pdf-to-excel"
                      initialMode="pdf-to-excel"
                    />
                  }
                />
                <Route path="/ocr-processor" element={<OCRProcessor />} />
                <Route path="/ocr-pdf-to-word" element={<OCRProcessor />} />
                <Route path="/pdf-compressor" element={<PDFCompressor />} />
                <Route path="/compress-pdf" element={<PDFCompressor />} />
                <Route path="/diamond-mines" element={<DiamondQuestGame />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                {/* Unknown URLs fall back to the landing page instead of a blank screen */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
