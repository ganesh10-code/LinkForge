import React from "react";
import Modal from "@mui/material/Modal";
import { QRCodeSVG } from "qrcode.react";

const QrCodeModal = ({ open, setOpen, url, shortUrl }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Make canvas size match SVG dimensions for better resolution
    const svgSize = parseInt(svg.getAttribute("width") || 256, 10);
    const padding = 20; // add some padding to the image
    const size = svgSize + padding * 2;
    
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      // Draw white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, size, size);
      
      // Draw image in center
      ctx.drawImage(img, padding, padding);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-${shortUrl}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="qr-modal-title"
      aria-describedby="qr-modal-description"
    >
      <div className="flex justify-center items-center h-full w-full">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center gap-6 outline-none">
          <h2 id="qr-modal-title" className="text-xl font-semibold text-slate-900">
            QR code
          </h2>
          <p className="text-sm text-slate-500 max-w-[256px] text-center truncate">{url}</p>
          <div className="p-2 bg-white border border-slate-200 rounded-md">
            <QRCodeSVG
              id="qr-code-svg"
              value={url}
              size={256}
              level={"H"}
              includeMargin={false}
            />
          </div>
          <button
            onClick={handleDownload}
            className="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors w-full"
          >
            Download
          </button>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QrCodeModal;
