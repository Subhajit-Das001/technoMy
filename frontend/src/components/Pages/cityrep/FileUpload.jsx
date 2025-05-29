import React, { useState } from "react";
import axios from "axios";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import './FileUpload.css';

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://technothlon.techniche.org.in/api/"
    : "http://localhost:3001/api/";

function FileUpload({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [errorState, setErrorState] = useState({ messages: [], title: "" });
  const [debugInfo, setDebugInfo] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState([
    { column: '', value: '' }
  ]);

  const EXPECTED_COLUMNS = [
    'name1', 'email1', 'contact1', 'school1',
    'name2', 'email2', 'contact2', 'school2',
    'squad', 'language', 'city', 'state'
  ];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setErrorState({ messages: [], title: "" });
    setDebugInfo(`Uploading ${file.name}`);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${baseURL}uploadcsv/uploadcsv`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setDebugInfo(`Processing... ${percentCompleted}%`);
        }
      });

      setDebugInfo("Upload successful!");
      onUploadSuccess(response.data);
      
    } catch (error) {
      console.error("Upload error:", error);
      handleUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadError = (error) => {
    if (error.response?.data?.error === 'Duplicate entry found') {
      setErrorState({
        title: "Duplicate Entry",
        messages: [error.response.data.message]
      });
      return;
    }

    if (error.response?.data?.details) {
      const { missingColumns, incorrectColumns } = error.response.data.details;
      const messages = [];
      
      if (missingColumns?.missing) {
        messages.push(`Missing required columns: ${missingColumns.missing.join(', ')}`);
      }
      
      if (incorrectColumns?.incorrect) {
        messages.push(`Extra columns found: ${incorrectColumns.incorrect.map(col => col.found).join(', ')}`);
        messages.push('Required columns are:');
        messages.push(EXPECTED_COLUMNS.join(', '));
      }
      
      setErrorState({
        title: "Column Format Issues",
        messages: messages
      });
    } else {
      setErrorState({
        title: "Upload Error",
        messages: ["An error occurred during upload. Please try again."]
      });
    }
  };

  const handleAddCriteria = () => {
    setSearchCriteria([...searchCriteria, { column: '', value: '' }]);
  };

  const handleRemoveCriteria = (index) => {
    const newCriteria = searchCriteria.filter((_, i) => i !== index);
    setSearchCriteria(newCriteria);
  };

  const handleCriteriaChange = (index, field, value) => {
    const newCriteria = [...searchCriteria];
    newCriteria[index][field] = value;
    setSearchCriteria(newCriteria);
  };

  const handleFetchData = async (e) => {
    e.preventDefault();
    
    const validCriteria = searchCriteria.filter(c => c.column && c.value);
    if (validCriteria.length === 0) {
      setErrorState({
        title: "Validation Error",
        messages: ["Please add at least one search criteria"]
      });
      return;
    }
  
    setFetchLoading(true);
    setErrorState({ messages: [], title: "" });
    setDebugInfo("Fetching data...");
  
    try {
      const response = await axios.post(`${baseURL}uploadcsv/fetch-data`, {
        criteria: validCriteria
      }, {
        withCredentials: true
      });
  
      setDebugInfo(`Found ${response.data.count} records! Downloading...`);
      window.location.href = `${baseURL}${response.data.fileUrl}`;
      
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorState({
        title: "Fetch Error",
        messages: [error.response?.data?.message || "Failed to fetch data"]
      });
    } finally {
      setFetchLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="required-columns-section">
        <h4 className="section-title">Required CSV Columns:</h4>
        <div className="columns-grid">
          {EXPECTED_COLUMNS.map(col => (
            <span key={col} className="column-tag">
              {col}
            </span>
          ))}
        </div>
      </div>

      <label className={`upload-button ${uploading ? 'uploading' : ''}`}>
        <Upload size={20} />
        <span>{uploading ? "Uploading..." : "Upload CSV/XLSX File"}</span>
        <input 
          type="file" 
          accept=".csv,.xlsx" 
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden-input"
        />
      </label>

      {debugInfo && (
        <div className="debug-info">
          <CheckCircle size={16} className="icon" />
          {debugInfo}
        </div>
      )}
      
      {errorState.messages.length > 0 && (
        <div className="error-container">
          <div className="error-header">
            <AlertCircle size={20} className="icon" />
            {errorState.title}
          </div>
          <div className="error-messages">
            {errorState.messages.map((message, idx) => (
              <div key={idx} className="error-message">{message}</div>
            ))}
          </div>
        </div>
      )}

      <div className="fetch-records-section">
        <h4 className="section-title">Fetch Existing Records</h4>
        
        <form onSubmit={handleFetchData} className="fetch-form">
          {searchCriteria.map((criteria, index) => (
            <div key={index} className="criteria-row">
              <div className="input-group">
                <select
                  value={criteria.column}
                  onChange={(e) => handleCriteriaChange(index, 'column', e.target.value)}
                  className="criteria-select"
                >
                  <option value="">Select Column</option>
                  {EXPECTED_COLUMNS.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                  <option value="rollNumber">rollNumber</option>
                  <option value="zone">zone</option>
                </select>
                
                <input
                  type="text"
                  value={criteria.value}
                  onChange={(e) => handleCriteriaChange(index, 'value', e.target.value)}
                  placeholder="Enter value to search"
                  className="criteria-input"
                />
              </div>
              
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCriteria(index)}
                  className="remove-criteria-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <div className="fetch-actions">
            <button
              type="button"
              onClick={handleAddCriteria}
              className="add-criteria-btn"
            >
              Add
            </button>
            
            <button
              type="submit"
              disabled={fetchLoading}
              className={`fetch-submit-btn ${fetchLoading ? 'loading' : ''}`}
            >
              {fetchLoading ? 'Fetching...' : 'Fetch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FileUpload;