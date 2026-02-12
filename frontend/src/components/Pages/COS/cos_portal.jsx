import React, { useState, useEffect } from "react";
import axios from "axios";
import { LogOut, Upload, Download, Users, School, Calendar } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './cos_portal.css';
import kvsLogo from '../../Assets/techno-owl.png';
import iitg2 from '../../Assets/img/iitg2.png';
import techniche from '../../Assets/img/technicheb.png';
import logo1 from '../../Assets/img/logo2.png';
import ob from '../../Assets/img/ob.png';

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://technothlon.techniche.org.in/api/"
    : "http://localhost:3001/api/";

function COSPortal() {
  const [dashboardData, setDashboardData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState(
    JSON.parse(localStorage.getItem("cos_uploadedFiles")) || []
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${baseURL}cos_portal/dashboard`, {
        withCredentials: true,
      });
      setDashboardData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (err.response?.status === 401) {
        window.location.href = process.env.NODE_ENV === "production"
          ? "https://technothlon.techniche.org.in/cos_login"
          : "http://localhost:3000/cos_login";
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast.error('Invalid file type. Please upload CSV or XLSX files only.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${baseURL}cos_portal/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // You can show progress here if needed
        },
      });

      if (response.data.success) {
        toast.success(`Successfully processed ${response.data.processedCount} teams!`);
        
        // Get the correct filename from backend response
        const fileName = response.data.fileName || `cos_output_${Date.now()}.csv`;
        const downloadUrl = `${baseURL}cos_portal/download/${fileName}`;
        
        // Download the file
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Save to local storage with correct filename
        const newFile = {
          createdAt: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          }),
          fileName: fileName,
          fileUrl: downloadUrl,
          processedCount: response.data.processedCount
        };

        const updatedFiles = [newFile, ...uploadedFiles];
        setUploadedFiles(updatedFiles);
        localStorage.setItem("cos_uploadedFiles", JSON.stringify(updatedFiles));

        // Refresh dashboard
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Upload error:", err);
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors;
        setError({
          title: err.response.data.error || "Validation Errors",
          messages: Array.isArray(errorMessages) ? errorMessages : [errorMessages]
        });
        toast.error(`Validation failed: ${err.response.data.message || 'Please check the errors below'}`);
      } else {
        setError({
          title: "Upload Failed",
          messages: [err.response?.data?.message || err.message || "An error occurred during upload"]
        });
        toast.error(err.response?.data?.message || "Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${baseURL}cos_portal/logout`, {
        withCredentials: true,
      });
      window.location.href = process.env.NODE_ENV === "production"
        ? "https://technothlon.techniche.org.in/cos_login"
        : "http://localhost:3000/cos_login";
    } catch (err) {
      console.error("Logout error:", err);
      // Still redirect even if logout fails
      window.location.href = process.env.NODE_ENV === "production"
        ? "https://technothlon.techniche.org.in/cos_login"
        : "http://localhost:3000/cos_login";
    }
  };

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  if (!dashboardData) {
    return (
      <div className="cos_kv_loading">
        <div className="cos_kv_spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="cos_kv_portal_wrapper">
      <ToastContainer />
      
      {/* Header Banner with Logos - Same as Registration */}
      {/* <div className="header-banner-reg">
        <div className="logo-container-reg">
          <img src={iitg2} alt="IIT Guwahati" className="institution-logo-reg" />
          <div className="ob-reg" style={{ backgroundImage: `url(${ob})` }}>
            <img 
              src={logo1} 
              alt="Technothlon" 
              className="main-logo-reg"
              onClick={handleLogoClick}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <img src={techniche} alt="Techniche" className="partner-logo-reg" />
        </div>
      </div> */}
      
      <header className="cos_kv_header">
        <div className="cos_kv_header_content">
          <div className="cos_kv_school_info">
            <img src={kvsLogo} alt="KVS Logo" className="cos_kv_school_icon" />
            <div>
              <h1 className="cos_kv_school_name">{dashboardData.school}</h1>
              <p className="cos_kv_school_code">Code: {dashboardData.code}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="cos_kv_logout_button">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="cos_kv_main_container">
        <div className="cos_kv_dashboard">
          <h2 className="cos_kv_dashboard_title">Dashboard</h2>
          
          <div className="cos_kv_stats_grid">
            <div className="cos_kv_stat_card">
              <Users className="cos_kv_stat_icon" />
              <div className="cos_kv_stat_content">
                <h3 className="cos_kv_stat_label">Total Registered Students</h3>
                <p className="cos_kv_stat_value">{dashboardData.total_registered_students}</p>
              </div>
            </div>

            <div className="cos_kv_stat_card">
              <School className="cos_kv_stat_icon" />
              <div className="cos_kv_stat_content">
                <h3 className="cos_kv_stat_label">Juniors Team</h3>
                <p className="cos_kv_stat_value">{dashboardData.junior_team}</p>
              </div>
            </div>

            <div className="cos_kv_stat_card">
              <School className="cos_kv_stat_icon" />
              <div className="cos_kv_stat_content">
                <h3 className="cos_kv_stat_label">Hauts Team</h3>
                <p className="cos_kv_stat_value">{dashboardData.hauts_team}</p>
              </div>
            </div>

            <div className="cos_kv_stat_card">
              <Calendar className="cos_kv_stat_icon" />
              <div className="cos_kv_stat_content">
                <h3 className="cos_kv_stat_label">Total Submissions</h3>
                <p className="cos_kv_stat_value">{dashboardData.count_of_submission}</p>
              </div>
            </div>
          </div>

          <div className="cos_kv_upload_section">
            <h3 className="cos_kv_section_title">Upload Student Data</h3>
            <p className="cos_kv_section_description">
              Upload CSV or XLSX file with required columns: name1, dob1 (DD/MM/YYYY format or Excel date), email1, contact1, class1, 
              name2, dob2 (DD/MM/YYYY format or Excel date), email2, contact2, class2, squad, language
            </p>
            
            <label className={`cos_kv_upload_button ${uploading ? 'cos_kv_uploading' : ''}`}>
              <Upload size={20} />
              <span>{uploading ? "Uploading..." : "Upload CSV/XLSX File"}</span>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                disabled={uploading}
                className="cos_kv_file_input"
              />
            </label>

            {error && (
              <div className="cos_kv_error_container">
                <div className="cos_kv_error_header">
                  {error.title}
                </div>
                <div className="cos_kv_error_messages">
                  {error.messages.map((message, idx) => (
                    <div key={idx} className="cos_kv_error_message">{message}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {uploadedFiles.length > 0 && (
            <div className="cos_kv_files_section">
              <h3 className="cos_kv_section_title">Download History</h3>
              <div className="cos_kv_files_list">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="cos_kv_file_item">
                    <div className="cos_kv_file_info">
                      <Download className="cos_kv_file_icon" />
                      <div>
                        <p className="cos_kv_file_name">{file.fileName}</p>
                        <p className="cos_kv_file_date">{file.createdAt}</p>
                        {file.processedCount && (
                          <p className="cos_kv_file_count">{file.processedCount} teams processed</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(file.fileUrl, file.fileName)}
                      className="cos_kv_download_button"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default COSPortal;
