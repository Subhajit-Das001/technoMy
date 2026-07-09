import React, { useState, useEffect } from "react";
import axios from "axios";
import { LogOut, Upload, Download, Users, School, Calendar,AlertCircle, Info, Send, X, MessageSquareWarning} from "lucide-react";
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

  // New states for Guidelines and Reporting
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [failedFileName, setFailedFileName] = useState(null);
  const [sendingReport, setSendingReport] = useState(false);
  const [fileHash, setFileHash] = useState("");
  const [downloadingCreds, setDownloadingCreds] = useState(false);
useEffect(() => {
    fetchDashboardData();
    // Show guidelines once per session
    const hasSeenGuidelines = sessionStorage.getItem("cos_seen_guidelines");
    if (!hasSeenGuidelines) {
      setShowGuidelines(true);
    }
  }, []);
  const closeGuidelines = () => {
    setShowGuidelines(false);
    sessionStorage.setItem("cos_seen_guidelines", "true");
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${baseURL}cos_portal/dashboard`, {
        withCredentials: true,
      });
      setDashboardData(response.data);
    } catch (err) {
      // console.error("Error fetching dashboard data:", err);
      if (err.response?.status === 401) {
        window.location.href = process.env.NODE_ENV === "production"
          ? "https://technothlon.techniche.org.in/school-registration"
          : "http://localhost:3000/school-registration";
      }
    }
  };
  // Reusable helper to trigger browser download
  const triggerCsvDownload = (csvData, fileName) => {
    const encodedUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`;
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Main Download Handler
  const handleDownloadAllCredentials = async () => {
    if (!dashboardData) return;
    
    // Check localStorage cache first
    const cacheKey = `cos_all_creds_${dashboardData.branch_id}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      try {
        const { csvData, fileName } = JSON.parse(cachedData);
        triggerCsvDownload(csvData, fileName);
        toast.success("Credentials downloaded from local cache!");
        return;
      } catch (e) {
        localStorage.removeItem(cacheKey); // Clear if corrupted
      }
    }

    setDownloadingCreds(true);
    try {
      const response = await axios.get(`${baseURL}cos_portal/credentials/download`, {
        withCredentials: true,
      });

      const { csvData, fileName } = response.data;

      // Save to localStorage for future clicks
      localStorage.setItem(cacheKey, JSON.stringify({ csvData, fileName }));

      triggerCsvDownload(csvData, fileName);
      toast.success("All credentials fetched and downloaded successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to download credentials.");
    } finally {
      setDownloadingCreds(false);
    }
  };
  // HnadleFileChange function with Redis Enabled
  // 1. The Gateway Handoff
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFailedFileName(file.name);
    
    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast.error('Invalid file type. Please upload CSV file only.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Hit the new Gateway API
      const response = await axios.post(`${baseURL}cos_portal/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // If successful, the backend returns a jobId. Start polling it.
      if (response.data.jobId) {
        pollJobStatus(response.data.jobId, file.name);
      }
    } catch (err) {
      handleUploadError(err);
      e.target.value = ''; // Reset file input
    }
  };

// 2. The Telemetry Poller
  const pollJobStatus = (jobId, originalFileName) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${baseURL}cos_portal/upload/status/${jobId}`, {
          withCredentials: true,
        });

        const { state, result, failedReason } = res.data;

        if (state === 'completed') {
          // FIX: The Production Race Condition Safety Net. 
          // If state is completed but result isn't saved yet, wait for the next tick!
          if (!result) return; 

          clearInterval(interval);
          handleUploadSuccess(result); 
          
          const fileInput = document.querySelector('.cos_kv_file_input');
          if(fileInput) fileInput.value = ''; 
          
        } else if (state === 'failed') {
          clearInterval(interval);
          
          let parsedError;
          try { 
            const cleanReason = failedReason.replace(/^Error:\s*/, '');
            parsedError = JSON.parse(cleanReason); 
            if (parsedError.fileHash) setFileHash(parsedError.fileHash);
          } catch (e) { 
            parsedError = { message: failedReason }; 
          }

          handleUploadError({ response: { data: parsedError } });
          
          const fileInput = document.querySelector('.cos_kv_file_input');
          if(fileInput) fileInput.value = '';
        }
      } catch (err) {
        clearInterval(interval);
        setUploading(false);
        toast.error("Lost connection to server while checking status.");
      }
    }, 2000);
  };

  // 3. Success UI Handler (No more backend file paths!)
  const handleUploadSuccess = (data) => {
    toast.success(`Successfully processed ${data.processedCount} teams!`);
    setFileHash(data.fileHash);
// --- ADD THIS LINE TO WIPE STALE CACHE ---
    if (dashboardData) {
      localStorage.removeItem(`cos_all_creds_${dashboardData.branch_id}`);
    }
    // 1. Convert the raw text string into a downloadable file in the browser
    const encodedUri = `data:text/csv;charset=utf-8,${encodeURIComponent(data.csvData)}`;
    
    // 2. Trigger auto-download instantly
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = data.fileName || `credentials_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    

    // 3. Save to localStorage
    const newFile = {
      createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      fileName: data.fileName,
      processedCount: data.processedCount,
      csvData: data.csvData // Storing the raw string so users can re-download it later
    };

    const updatedFiles = [newFile, ...uploadedFiles];
    setUploadedFiles(updatedFiles);
    localStorage.setItem("cos_uploadedFiles", JSON.stringify(updatedFiles));
    
    setFailedFileName(null);
    setUploading(false);
    fetchDashboardData();
  };
  // 4. Error UI Handler
  // 4. Error UI Handler
  const handleUploadError = (err) => {
    // FIX: Force the loading spinner to stop immediately
    setUploading(false); 
    
    const responseData = err.response?.data || {};

    if (responseData.errors) {
      // Handles multi-row validation errors (e.g. bad emails on rows 5, 10, 12)
      setError({
        title: responseData.error || "Validation Errors",
        messages: Array.isArray(responseData.errors) ? responseData.errors : [responseData.errors]
      });
      toast.error(`Validation failed: ${responseData.message || 'Please check the errors below'}`);
      
    } else {
      // Handles single systemic errors (e.g. "Limit Exceeded", "Duplicate File")
      setError({
        title: responseData.error || "Upload Failed",
        messages: [responseData.message || err.message || "An error occurred during upload"]
      });
      toast.error(responseData.message || "Upload failed. Please try again.");
    }
  };
//This is the normal HandleFIle change function without Redis Enabled


//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
// setFailedFileName(file.name);
//     // Validate file type
//     const validTypes = [
//       'text/csv',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       'application/vnd.ms-excel'
//     ];
    
//     if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
//       toast.error('Invalid file type. Please upload CSV file only.');
//       return;
//     }

//     setUploading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post(`${baseURL}cos_portal/upload`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         withCredentials: true, 
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           // You can show progress here if needed
//         },
//       });

//       if (response.data.success) {
//         toast.success(`Successfully processed ${response.data.processedCount} teams!`);
//         setFileHash(response.data.fileHash);
//         // Get the correct filename from backend response
//         const fileName = response.data.fileName || `cos_output_${Date.now()}.csv`;
//         const downloadUrl = `${baseURL}cos_portal/download/${fileName}`;
        
//         // Download the file
//         const link = document.createElement('a');
//         link.href = downloadUrl;
//         link.download = fileName;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);

//         // Save to local storage with correct filename
//         const newFile = {
//           createdAt: new Date().toLocaleString("en-US", {
//             timeZone: "Asia/Kolkata",
//           }),
//           fileName: fileName,
//           fileUrl: downloadUrl,
//           processedCount: response.data.processedCount
//         };

//         const updatedFiles = [newFile, ...uploadedFiles];
//         setUploadedFiles(updatedFiles);
//         localStorage.setItem("cos_uploadedFiles", JSON.stringify(updatedFiles));
// setFailedFileName(null);
//         // Refresh dashboard
//         fetchDashboardData();
//       }
//     } catch (err) {
//       // console.error("Upload error:", err);
//       if (err.response?.data?.errors) {
//         const errorMessages = err.response.data.errors;
//         setError({
//           title: err.response.data.error || "Validation Errors",
//           messages: Array.isArray(errorMessages) ? errorMessages : [errorMessages]
//         });
//         toast.error(`Validation failed: ${err.response.data.message || 'Please check the errors below'}`);
//       } else {
//         setError({
//           title: "Upload Failed",
//           messages: [err.response?.data?.message || err.message || "An error occurred during upload"]
//         });
//         toast.error(err.response?.data?.message || "Upload failed. Please try again.");
//       }
//     } finally {
//       setUploading(false);
//       // Reset file input
//       e.target.value = '';
//     }
//   };
const handleSendReport = async (e) => {
    e.preventDefault();
    if (!reportMessage.trim()) {
      toast.warning("Please enter a message for the admin.");
      return;
    }

    setSendingReport(true);
    try {
      // Sending detailed payload for backend DB and Mailer
      await axios.post(`${baseURL}cos_portal/report`, {
        branch_id: dashboardData.branch_id,
        branch_name: dashboardData.branch_name,
        fileName: failedFileName || "Unknown/No file",
        errorDetails: error,
        fileHash: fileHash || "No file hash",
        message: reportMessage
      }, { withCredentials: true });
      
      toast.success("Report sent to admin. It will be resolved within 24 hours.");
      setShowReportModal(false);
      setReportMessage("");
    } catch (err) {
      toast.error("Failed to send report. Please try again later.");
    } finally {
      setSendingReport(false);
    }
  };
  const handleDownload = (file) => {
    if (file.csvData) {
      // Use the synchronous Data URI method
      const encodedUri = `data:text/csv;charset=utf-8,${encodeURIComponent(file.csvData)}`;
      const link = document.createElement('a');
      link.href = encodedUri;
      link.download = file.fileName || `credentials_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } 
    else if (file.fileUrl) {
      // Fallback for files uploaded BEFORE our update
      window.open(file.fileUrl, '_blank');
    } else {
      toast.error("File data is no longer available. Contact Administrator for re-sharing credentials.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${baseURL}cos_portal/logout`, {
        withCredentials: true,
      });
      window.location.href = process.env.NODE_ENV === "production"
        ? "https://technothlon.techniche.org.in/school-registration"
        : "http://localhost:3000/school-registration";
    } catch (err) {
      // console.error("Logout error:", err);
      // Still redirect even if logout fails
      sessionStorage.removeItem("cos_seen_guidelines");
      window.location.href = process.env.NODE_ENV === "production"
        ? "https://technothlon.techniche.org.in/school-registration"
        : "http://localhost:3000/school-registration";
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
              <h1 className="cos_kv_school_name">{dashboardData.branch_name}</h1>
              <p className="cos_kv_school_code">Branch ID: {dashboardData.branch_id}</p>
            </div>
          </div>
          <div className="cos_kv_header_actions">
            <button onClick={() => setShowGuidelines(true)} className="cos_kv_btn_outline_blue">
              <Info size={20} /> <span>Guidelines</span>
            </button>
            <button onClick={handleLogout} className="cos_kv_logout_button">
              <LogOut size={20} /> <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      <div className="cos_kv_main_container">
        <div className="cos_kv_dashboard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="cos_kv_dashboard_title" style={{ margin: 0 }}>Dashboard</h2>
            
            <button 
              onClick={handleDownloadAllCredentials}
              disabled={downloadingCreds || dashboardData?.total_registered_students === 0}
              className={`cos_kv_btn_outline_blue ${downloadingCreds ? 'disabled' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Download size={18} /> 
              <span>{downloadingCreds ? "Generating CSV..." : "Download All Credentials"}</span>
            </button>
          </div>
          
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
              Upload CSV file with required columns: name1, dob1 (DD/MM/YYYY format), email1, contact1, class1, 
              name2, dob2 (DD/MM/YYYY format), email2, contact2, class2, squad, language
            </p>
            {/* --- NEW FLEX WRAPPER START --- */}
  <div className="cos_kv_upload_actions_wrapper">
    
    {/* Upload Button stays on the left */}
    <div className="cos_kv_upload_action_area">
      <label className={`cos_kv_upload_button ${uploading ? 'cos_kv_uploading' : ''}`}>
        <Upload size={18} />
        <span>{uploading ? "Uploading..." : "Upload CSV File"}</span>
        <input type="file" accept=".csv" onChange={handleFileChange} disabled={uploading} className="cos_kv_file_input" />
      </label>
    </div>

    {/* Report Button moves to the right */}
    <button 
      onClick={() => setShowReportModal(true)} 
      disabled={!error}
      className={`cos_kv_report_btn ${!error ? 'disabled' : ''}`}
    >
      <AlertCircle size={18} /> <span>Report Issue</span>
    </button>
    
  </div>
  {/* --- NEW FLEX WRAPPER END --- */}
            {error && (
              <div className="cos_kv_error_container">
                <div className="cos_kv_error_header">
                  <AlertCircle size={18} /> {error.title}
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
                      onClick={() => handleDownload(file)}
                      className="cos_kv_download_button"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
{/* --- MODALS --- */}
{/* 3. Guidelines Modal Match */}
      {showGuidelines && (
        <div className="cos_modal_overlay">
          <div className="cos_modal_content guidelines_modal">
            <div className="modal_header">
              <h2><Info size={20} className="text_blue"/> CSV Upload Guidelines</h2>
              <button onClick={closeGuidelines} className="close_btn"><X size={20}/></button>
            </div>
            <div className="modal_body">
              <ul className="guidelines_list">
                <li>
                  <strong>Naming Format:</strong> The file name must strictly be:<br/>
                  <code className="code_inline">CSV_&lt;Sr_no.&gt;_&lt;Branch_name&gt;_&lt;School_name&gt;.csv</code>
                </li>
                {/* <li>
                  <strong>Unique Files:</strong> Ensure no two CSV files uploaded have the identical file name.
                </li> */}
                <li>
                  <strong>Required Fields:</strong> The file must contain exactly <strong>12</strong> fields with case-sensitive titles.
                </li>
                <li>
                  <strong>Column Headers:</strong> Use exactly these titles in row 1:
                  <div className="code_block">
                    name1, dob1, email1, contact1, class1, name2, dob2, email2, contact2, class2, squad, language
                  </div>
                </li>
                <li>
                  <strong>Assistance:</strong> Any errors will be displayed on your screen. If you are still unable to upload after checking errors, click the <strong>Report Issue</strong> button to contact our team.
                </li>
                <li>
                  <strong>Credentials:</strong> After uploading the CSV, download the credentials file containing the roll numbers and passwords of all participants. You can also access it later from Download History.
                </li>
              </ul>
            </div>
            <div className="modal_footer right_align">
              <button onClick={closeGuidelines} className="cos_btn_solid_blue">I Understand, Proceed</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Report Modal Match */}
      {showReportModal && (
        <div className="cos_modal_overlay">
          <div className="cos_modal_content report_modal">
            <div className="modal_header">
              <h2 className="text_red"><AlertCircle size={20}/> Report Issue</h2>
              <button onClick={() => setShowReportModal(false)} className="close_btn"><X size={20}/></button>
            </div>
            <div className="modal_body">
              <form onSubmit={handleSendReport}>
                <p className="report_helper_text">It will be sent to Admin through mail and will be resolved within 24 hours.</p>
                <div className="form_group">
                  <label>Message</label>
                  <textarea 
                    value={reportMessage} onChange={(e) => setReportMessage(e.target.value)}
                    placeholder="Describe the issue you are facing..." rows="4" required
                  />
                </div>
                <div className="modal_footer right_align no_border">
                  <button type="submit" className="cos_btn_solid_blue" disabled={sendingReport}>
                    {sendingReport ? "Sending..." : "Send Report"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

        </div>
      </div>
    </div>
  );
}

export default COSPortal;
