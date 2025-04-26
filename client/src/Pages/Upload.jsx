// PDFUpload.jsx

import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://iba-nceac.onrender.com/upload-pdf",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setPdfUrl(res.data.url);
    } catch (err) {
      console.error("Upload error:", err);
      alert("PDF upload failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload PDF to Cloudinary</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} style={{ marginLeft: "1rem" }}>
        Upload PDF
      </button>
      {pdfUrl && (
        <div style={{ marginTop: "1rem" }}>
          <p>Uploaded PDF URL:</p>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            {pdfUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default Upload;
