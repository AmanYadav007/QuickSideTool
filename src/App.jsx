import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
// import GoogleAds from "./components/GoogleAds";
import GTMBody from "./components/GTMBody";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/Home";
import Toolkit from "./pages/Toolkit";
import PDFTool from "./pages/PDFTool";
import ImageTools from "./pages/ImageTools";
import ImageResize from "./components/ImageResize";
import ImageCompressor from "./components/ImageCompressor";
import QrCodeGenerator from "./components/QrCodeGenerator";
import PDFLinkRemover from "./components/PDFLinkRemover";
import PDFUnlocker from "./components/PDFUnlocker";
import PDFToWordConverter from "./components/PDFToWordConverter";
import OCRProcessor from "./components/OCRProcessor";
import PDFCompressor from "./components/PDFCompressor";
import WordToPDFConverter from "./components/WordToPDFConverter";
import FileConverterNew from "./components/FileConverterNew";

import DiamondQuestGame from "./components/DiamondQuestGame";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Blog from './pages/Blog';

import "./index.css";

function App() {
  return (
    <HelmetProvider>
      {/* Ads disabled */}
      <GTMBody />
      <ErrorBoundary>
        <AuthProvider>
    <Router>
      <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/toolkit" element={<Toolkit />} />
        <Route path="/pdf-tool" element={<PDFTool />} />
        {/* Keyword-friendly aliases */}
        <Route path="/pdf-editor" element={<PDFTool />} />
        <Route path="/image-tools" element={<ImageTools />} />
        <Route path="/image-tools/resize" element={<ImageResize />} />
        <Route path="/image-resizer" element={<ImageResize />} />
        <Route path="/image-tools/compress" element={<ImageCompressor />} />
        <Route path="/image-compressor" element={<ImageCompressor />} />
              <Route path="/qr-tool" element={<QrCodeGenerator />} />
        <Route path="/qr-code-generator" element={<QrCodeGenerator />} />
        <Route path="/unlock-pdf" element={<PDFUnlocker />} />
        <Route path="/remove-pdf-password" element={<PDFUnlocker />} />
        <Route path="/pdf-link-remove" element={<PDFLinkRemover />} />
        <Route path="/remove-links-from-pdf" element={<PDFLinkRemover />} />
              <Route path="/pdf-to-word" element={<PDFToWordConverter />} />
        <Route path="/pdf-to-docx" element={<PDFToWordConverter />} />
              <Route path="/ocr-processor" element={<OCRProcessor />} />
        <Route path="/ocr-pdf-to-word" element={<OCRProcessor />} />
                              <Route path="/pdf-compressor" element={<PDFCompressor />} />
        <Route path="/compress-pdf" element={<PDFCompressor />} />
                <Route path="/word-to-pdf" element={<WordToPDFConverter />} />
        <Route path="/docx-to-pdf" element={<WordToPDFConverter />} />
                <Route path="/file-converter" element={<FileConverterNew />} />

                <Route path="/diamond-mines" element={<DiamondQuestGame />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
    </Router>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
