import React, { useEffect, useRef, useState } from "react";
import { Camera, Check, X } from "lucide-react";

/**
 * Full-screen camera viewfinder. Stays open so several pages can be shot in a
 * row; each shot is handed to `onCapture` as a canvas.
 * `onFallback` opens the device's own camera app (via a file input) when the
 * browser won't give us the camera, e.g. permission denied.
 */
const CameraCapture = ({ onCapture, onClose, onFallback }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [shots, setShots] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let stream;
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 2560 },
          height: { ideal: 1440 },
        },
        audio: false,
      })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        videoRef.current.srcObject = s;
      })
      .catch((e) => {
        setError(
          e.name === "NotAllowedError"
            ? "Camera access was blocked."
            : "No camera is available here.",
        );
      });
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const capture = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    onCapture(canvas);
    setShots((n) => n + 1);
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-black"
      role="dialog"
      aria-label="Camera"
    >
      <div className="flex items-center justify-between p-3 text-white">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 hover:bg-white/10"
          aria-label="Close camera"
        >
          <X className="h-6 w-6" />
        </button>
        <p className="text-sm text-white/80">
          {shots
            ? `${shots} page${shots > 1 ? "s" : ""} scanned`
            : "Fit the page in the frame"}
        </p>
        <span className="w-10" />
      </div>

      <div className="relative flex-1 overflow-hidden">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center text-white">
            <p className="font-semibold">{error}</p>
            <button type="button" onClick={onFallback} className="btn-primary">
              <Camera className="h-4 w-4" /> Use your camera app
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => setReady(true)}
            className="h-full w-full object-contain"
          />
        )}
        {flash && <div className="absolute inset-0 bg-white/70" />}
      </div>

      {!error && (
        <div className="flex items-center justify-center gap-10 p-6">
          <span className="w-16" />
          <button
            type="button"
            onClick={capture}
            disabled={!ready}
            aria-label="Take photo"
            className="h-16 w-16 rounded-full border-4 border-white bg-white/20 transition-transform active:scale-90 disabled:opacity-40"
          />
          {shots > 0 ? (
            <button
              type="button"
              onClick={onClose}
              className="flex w-16 flex-col items-center text-sm font-semibold text-white"
            >
              <Check className="h-6 w-6" /> Done
            </button>
          ) : (
            <span className="w-16" />
          )}
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
