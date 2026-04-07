import React, { useMemo, useRef, useState } from "react";
import SEO from "./SEO";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Mail,
  MessageCircle,
  Phone,
  QrCode,
  Type,
  User,
  Wifi,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const qrTypes = [
  { id: "url", label: "URL", icon: QrCode },
  { id: "text", label: "Text", icon: Type },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "contact", label: "Contact", icon: User },
];

const QRCodeGenerator = () => {
  const [qrType, setQrType] = useState("url");
  const [form, setForm] = useState({
    url: "",
    text: "",
    wifiSsid: "",
    wifiPassword: "",
    wifiEncryption: "WPA",
    whatsappPhone: "",
    whatsappMessage: "",
    email: "",
    emailSubject: "",
    emailBody: "",
    phone: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactCompany: "",
  });
  const [qrSize, setQrSize] = useState(256);
  const [qrFgColor, setQrFgColor] = useState("#111827");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [downloadFormat, setDownloadFormat] = useState("png");
  const qrRef = useRef(null);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const qrValue = useMemo(() => {
    switch (qrType) {
      case "text":
        return form.text.trim();
      case "wifi":
        return form.wifiSsid.trim()
          ? `WIFI:T:${form.wifiEncryption};S:${escapeWifiValue(form.wifiSsid)};P:${escapeWifiValue(form.wifiPassword)};;`
          : "";
      case "whatsapp":
        return form.whatsappPhone.trim()
          ? `https://wa.me/${digitsOnly(form.whatsappPhone)}${form.whatsappMessage ? `?text=${encodeURIComponent(form.whatsappMessage)}` : ""}`
          : "";
      case "email":
        return form.email.trim()
          ? `mailto:${form.email.trim()}?subject=${encodeURIComponent(form.emailSubject)}&body=${encodeURIComponent(form.emailBody)}`
          : "";
      case "phone":
        return form.phone.trim() ? `tel:${form.phone.trim()}` : "";
      case "contact":
        return form.contactName.trim() || form.contactPhone.trim() || form.contactEmail.trim()
          ? [
              "BEGIN:VCARD",
              "VERSION:3.0",
              `FN:${form.contactName.trim()}`,
              form.contactCompany.trim() ? `ORG:${form.contactCompany.trim()}` : "",
              form.contactPhone.trim() ? `TEL:${form.contactPhone.trim()}` : "",
              form.contactEmail.trim() ? `EMAIL:${form.contactEmail.trim()}` : "",
              "END:VCARD",
            ].filter(Boolean).join("\n")
          : "";
      case "url":
      default:
        return form.url.trim();
    }
  }, [form, qrType]);

  const effectiveSize = Math.max(64, Math.min(1024, Number(qrSize) || 256));
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
      triggerDownload(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`,
        `${fileNameBase}.svg`
      );
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
      triggerDownload(
        canvas.toDataURL(isJpg ? "image/jpeg" : "image/png", 0.92),
        `${fileNameBase}.${isJpg ? "jpg" : "png"}`
      );
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert("Could not convert the QR code. Please try SVG.");
    };

    img.src = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08111f] via-[#0b1f2a] to-[#102f2e] text-white">
      <SEO
        title="Free QR Code Generator - URL, Wi-Fi, WhatsApp, Contact"
        description="Make QR codes for links, text, Wi-Fi, WhatsApp, email, phone, and contacts. Export as PNG, JPG, or SVG."
        url="https://quicksidetool.com/qr-code-generator"
      />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 md:px-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link
            to="/toolkit"
            className="inline-flex items-center rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm text-white transition hover:border-amber-200 hover:bg-white/15"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <h1 className="text-center text-2xl font-bold text-amber-100 md:text-3xl">
            QR Code Generator
          </h1>
          <div className="w-20" />
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-white/10 bg-[#0b1f2a]/85 p-5 md:p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">
              Choose QR type
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {qrTypes.map((type) => {
                const Icon = type.icon;
                const active = qrType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setQrType(type.id)}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                      active
                        ? "border-amber-200 bg-amber-300 text-slate-950"
                        : "border-white/10 bg-white/5 text-white hover:border-amber-200 hover:bg-amber-200/10"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <QRFields qrType={qrType} form={form} updateForm={updateForm} />
            </div>

            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <h2 className="font-semibold text-white">Export settings</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Size</span>
                  <input
                    type="number"
                    min="64"
                    max="1024"
                    value={qrSize}
                    onChange={(event) => setQrSize(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">QR color</span>
                  <input
                    type="color"
                    value={qrFgColor}
                    onChange={(event) => setQrFgColor(event.target.value)}
                    className="h-10 w-full rounded-lg bg-transparent"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Background</span>
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(event) => setQrBgColor(event.target.value)}
                    className="h-10 w-full rounded-lg bg-transparent"
                  />
                </label>
              </div>
            </div>
          </section>

          <aside className="rounded-lg border border-white/10 bg-[#0b1f2a]/85 p-5 md:p-6">
            <h2 className="text-lg font-semibold text-white">Preview</h2>
            <p className="mt-1 text-sm text-slate-400">
              Fill the form and download when ready.
            </p>
            <div
              ref={qrRef}
              className="mt-6 flex justify-center rounded-lg border border-white/10 bg-white p-6"
            >
              <QRCodeSVG
                value={valueForPreview}
                size={effectiveSize}
                fgColor={qrFgColor}
                bgColor={qrBgColor}
                className="h-auto max-h-[280px] w-auto max-w-full"
                level="H"
                includeMargin
              />
            </div>

            <div className="mt-5 flex gap-3">
              <select
                value={downloadFormat}
                onChange={(event) => setDownloadFormat(event.target.value)}
                className="w-28 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="svg">SVG</option>
              </select>
              <button
                onClick={downloadQRCode}
                disabled={!qrValue}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 py-2 font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

const QRFields = ({ qrType, form, updateForm }) => {
  if (qrType === "text") {
    return (
      <TextareaField
        label="Text"
        value={form.text}
        onChange={(value) => updateForm("text", value)}
        placeholder="Write the text you want to share"
      />
    );
  }

  if (qrType === "wifi") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Network name" value={form.wifiSsid} onChange={(value) => updateForm("wifiSsid", value)} placeholder="My Wi-Fi" />
        <TextField label="Password" value={form.wifiPassword} onChange={(value) => updateForm("wifiPassword", value)} placeholder="Wi-Fi password" />
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Security</span>
          <select
            value={form.wifiEncryption}
            onChange={(event) => updateForm("wifiEncryption", event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">No password</option>
          </select>
        </label>
      </div>
    );
  }

  if (qrType === "whatsapp") {
    return (
      <div className="grid gap-4">
        <TextField label="Phone number with country code" value={form.whatsappPhone} onChange={(value) => updateForm("whatsappPhone", value)} placeholder="919876543210" />
        <TextareaField label="Message" value={form.whatsappMessage} onChange={(value) => updateForm("whatsappMessage", value)} placeholder="Hi, I found you through this QR code." />
      </div>
    );
  }

  if (qrType === "email") {
    return (
      <div className="grid gap-4">
        <TextField label="Email address" value={form.email} onChange={(value) => updateForm("email", value)} placeholder="hello@example.com" />
        <TextField label="Subject" value={form.emailSubject} onChange={(value) => updateForm("emailSubject", value)} placeholder="Quick message" />
        <TextareaField label="Body" value={form.emailBody} onChange={(value) => updateForm("emailBody", value)} placeholder="Write the email body" />
      </div>
    );
  }

  if (qrType === "phone") {
    return (
      <TextField
        label="Phone number"
        value={form.phone}
        onChange={(value) => updateForm("phone", value)}
        placeholder="+91 98765 43210"
      />
    );
  }

  if (qrType === "contact") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Name" value={form.contactName} onChange={(value) => updateForm("contactName", value)} placeholder="Aman Yadav" />
        <TextField label="Phone" value={form.contactPhone} onChange={(value) => updateForm("contactPhone", value)} placeholder="+91 98765 43210" />
        <TextField label="Email" value={form.contactEmail} onChange={(value) => updateForm("contactEmail", value)} placeholder="hello@example.com" />
        <TextField label="Company" value={form.contactCompany} onChange={(value) => updateForm("contactCompany", value)} placeholder="QuickSideTool" />
      </div>
    );
  }

  return (
    <TextField
      label="Website URL"
      value={form.url}
      onChange={(value) => updateForm("url", value)}
      placeholder="https://quicksidetool.com"
    />
  );
};

const TextField = ({ label, value, onChange, placeholder }) => (
  <label className="block">
    <span className="mb-2 block text-sm text-slate-300">{label}</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
    />
  </label>
);

const TextareaField = ({ label, value, onChange, placeholder }) => (
  <label className="block">
    <span className="mb-2 block text-sm text-slate-300">{label}</span>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
    />
  </label>
);

const triggerDownload = (href, filename) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const digitsOnly = (value) => value.replace(/[^\d]/g, "");
const escapeWifiValue = (value) => value.replace(/([\\;,":])/g, "\\$1");

export default QRCodeGenerator;
