import React, { useState, useEffect } from "react";
import axios from "axios";
import { LogOut } from "lucide-react";
import FileUpload from "../../Pages/cityrep/FileUpload";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./cityrep_portal.css";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://technothlon.techniche.org.in/api/"
    : "http://localhost:3001/api/";

function CityRepPortal() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [zone, setZone] = useState("");
  const [photo, setPhoto] = useState("https://placehold.co/100");
  const [uploadedFiles, setUploadedFiles] = useState(
    JSON.parse(localStorage.getItem("uploadedFiles")) || []
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}cityrep_portal/user`, {
          withCredentials: true,
        });
        const user = response.data;
        setName(user.name || "");
        setCity(user.city || "");
        setZone(user.zone || "");
        setPhoto(user.photoLink || "https://placehold.co/100");
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, []);

  const handleUploadSuccess = async (responseData) => {
    if (responseData.error) {
      setError(responseData.error);
      return;
    }

    try {
      const downloadResponse = await axios.get(
        `${baseURL}uploadcsv/downloadcsv?batchId=${responseData.batchId}`
      );
      const { schoolName, fileName, fileUrl } = downloadResponse.data;
      const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });

      const newFile = {
        createdAt: timestamp,
        schoolName: schoolName || "Unknown School",
        fileName,
        fileUrl: `${baseURL}${fileUrl}`,
      };

      const updatedFiles = [newFile, ...uploadedFiles];
      setUploadedFiles(updatedFiles);
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
      
      // Add toast notification
      toast.success('Your file is ready for download!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error fetching download details:", error);
      setError("Failed to fetch file details.");
    }
  };

  const Logout = () => {
    window.location.href =
      process.env.NODE_ENV === "production"
        ? "https://technothlon.techniche.org.in/cityreplogin"
        : "http://localhost:3000/cityreplogin";
  };

  return (
    <div className="crp-container">
      <ToastContainer />
      <header className="crp-header">
        <div className="crp-header-content">
          <div className="crp-user-info">
            <img src={photo} alt={name} className="crp-user-avatar" />
            <div className="crp-user-details flex flex-col">
              <h1 className="crp-user-name">{name}</h1>
              <div className="flex items-start space-x-4"> {/* Modified to align items in one line */}
                <p className="crp-user-city text-blue-500   flex items-center gap-2">
                  <span>Representative</span>
                  <span>of</span>
                  <span>{city}</span>
                </p>
                <p className="crp-user-zone text-blue-500 flex items-center gap-1">
                  <span>Zone:</span>
                  <span>{zone}</span>
                </p>
              </div>
            </div>
          </div>
          <button onClick={Logout} className="crp-logout-button">
            <LogOut className="crp-logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="crp-main">
        {error && <div className="crp-error">{error}</div>}

        <div className="crp-card">
          <h2 className="crp-card-title">Upload Documents</h2>
          
          <div className="crp-upload-area">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>

        <div className="crp-card">
          <h2 className="crp-card-title">Uploaded Files</h2>
          {uploadedFiles.length > 0 ? (
            <table className="crp-table">
              <thead>
                <tr>
                  <th>Created At</th>
                  <th>School Name</th>
                  <th>Download File</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file, index) => (
                  <tr key={index}>
                    <td>{new Date(file.createdAt).toLocaleString()}</td>
                    <td>{file.schoolName}</td>
                    <td>
                      <a href={file.fileUrl} download>{file.fileName}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="crp-empty-state">No files uploaded yet</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default CityRepPortal;