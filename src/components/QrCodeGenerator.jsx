import React, { useMemo, useRef, useState } from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, QrCode, Type } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const qrTypes = [
  { id: "url", label: "URL", icon: QrCode },
  { id: "text", label: "Text", icon: Type },
];

const QRCodeGenerator = () => {
  const [qrType, setQrType] = useState("url");
  const [form, setForm] = useState({
    url: "",
    text: "",
  });
  const [downloadFormat, setDownloadFormat] = useState("png");
  const qrRef = useRef(null);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const qrValue = useMemo(() => {
    switch (qrType) {
      case "text":
        return form.text.trim();
      case "url":
      default:
        return form.url.trim();
    }
  }, [form, qrType]);

  const effectiveSize = 256;
  const valueForPreview = qrValue || "https://quicksidetool.com";

  const downloadQRCode = () => {
    if (!qrRef.current) {
      alert("QR Code not ready for download.");
      return;
    }
    const svg = qrRef.current.querySelector("svg");
    if (!svg) {
      alert("QR Code SVG element not found.");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const fileNameBase = `${qrType}_qr_code`;

    if (downloadFormat === "svg") {
      const link = document.createElement("a");
      link.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
      link.download = `${fileNameBase}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = effectiveSize;
      canvas.height = effectiveSize;
      ctx.drawImage(img, 0, 0, effectiveSize, effectiveSize);
      const isJpg = downloadFormat === "jpg";
      const link = document.createElement("a");
      link.href = canvas.toDataURL(isJpg ? "image/jpeg" : "image/png", 0.92);
      link.download = `${fileNameBase}.${isJpg ? "jpg" : "png"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert("Could not convert the QR code. Please try SVG.");
    };

    img.src = url;
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEO
        title="Free QR Code Generator - URL & Text"
        description="Make QR codes for links and text. Export as PNG, JPG, or SVG. Free, no registration."
        url="https://quicksidetool.com/qr-code-generator"
      />

      <div className="container section">
        <header className="mb-8 flex items-center justify-between">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Tools
          </Link>
          <h1 className="h1 text-center">QR Code Generator</h1>
        </header>

        <div className="max-w-3xl mx-auto">
          <div className="card p-8 mb-8">
            <h2 className="h3 mb-4">Choose QR type</h2>
            <div className="grid grid-cols-2 gap-3">
              {qrTypes.map((type) => {
                const Icon = type.icon;
                const active = qrType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setQrType(type.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 font-semibold ${
                      active
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-alt)] text-[var(--color-text)]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {type.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">
                  {qrType === "url" ? "Website URL" : "Text"}
                </span>
                {qrType === "url" && (
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => updateForm("url", e.target.value)}
                    placeholder="https://example.com"
                    className="input"
                  />
                )}
                {qrType === "text" && (
                  <textarea
                    value={form.text}
                    onChange={(e) => updateForm("text", e.target.value)}
                    placeholder="Write the text you want to share"
                    rows={4}
                    className="input"
                  />
                )}
              </label>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="h3 mb-2">Preview</h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">Fill the form and download when ready.</p>

            <div className="flex justify-center mb-6">
              <div
                ref={qrRef}
                className="rounded-xl border border-[var(--color-border)] bg-white p-6"
              >
                <QRBoundary key={valueForPreview}>
                  <QRCodeSVG
                    value={valueForPreview}
                    size={effectiveSize}
                    fgColor="#111827"
                    bgColor="#ffffff"
                    className="h-auto max-h-[280px] w-auto max-w-full"
                    level="M"
                    includeMargin
                  />
                </QRBoundary>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                className="input sm:w-32"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="svg">SVG</option>
              </select>
              <button
                onClick={downloadQRCode}
                disabled={!qrValue}
                className="btn-primary flex-1"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>

            {!qrValue && (
              <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
                {qrType === "url"
                  ? "Enter a URL above to generate a QR code."
                  : "Enter text above to generate a QR code."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

class QRBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <p className="max-w-[280px] py-12 text-center text-sm font-medium text-[var(--color-text-muted)]">
          This content is too long to fit in a QR code. Shorten it and try again.
        </p>
      );
    }
    return this.props.children;
  }
}

export default QRCodeGenerator;