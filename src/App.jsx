import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PDFTool from "./pages/PDFTool";
import ImageTools from "./pages/ImageTools";
import ImageResize from "./components/ImageResize";
import ImageCompressor from "./components/ImageCompressor";
import QRCodeGeneratot from "./components/QrCodeGenerator";
import PDFLinkRemover from "./components/PDFLinkRemover";
import PDFUnlocker from "./components/PDFUnlocker";
import DiamondQuestGame from "./components/DiamondQuestGame";

import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pdf-tool" element={<PDFTool />} />
        <Route path="/image-tools" element={<ImageTools />} />
        <Route path="/image-tools/resize" element={<ImageResize />} />
        <Route path="/image-tools/compress" element={<ImageCompressor />} />
        <Route path="/qr-tool" element={<QRCodeGeneratot />} />
        <Route path="/unlock-pdf" element={<PDFUnlocker />} />
        <Route path="/pdf-link-remove" element={<PDFLinkRemover />} />
        <Route path="/diamond-mines" element={<DiamondQuestGame />} />
      </Routes>
    </Router>
  );
}

export default App;
