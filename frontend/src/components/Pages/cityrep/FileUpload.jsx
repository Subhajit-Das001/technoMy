import React, { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";
import "./FileUpload.css";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://technothlon.techniche.org.in/api/"
    : "http://localhost:3001/api/";

function FileUpload({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${baseURL}uploadcsv/uploadcsv`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploadSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <label className="file-upload-label">
        <Upload className="file-upload-icon" />
        <span>{uploading ? "Uploading..." : "Upload CSV File"}</span>
        <input type="file" accept=".csv" onChange={handleFileChange} hidden />
      </label>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default FileUpload;
