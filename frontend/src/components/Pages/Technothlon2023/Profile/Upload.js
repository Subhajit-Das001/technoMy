import React, { useState } from 'react';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [centreFile, setCentreFile] = useState(null);
  const [resultFile, setResultFile] = useState(null);
  const [school, setSchool] = useState('');
  const [studentCount, setStudentCount] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCentreFileChange = (event) => {
    setCentreFile(event.target.files[0]);
  };

  const handleResultFileChange = (event) => {
    setResultFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("school", school);
    formData.append("studentcount", studentCount);

    try {
      const response = await fetch("http://localhost:3001/api/uploadcsv/uploadcsv", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Upload successful", data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Error in uploading file. Check for duplicate entries in CSV.");
    }
  };

  const handleCenterUpload = async () => {
    if (!centreFile) {
      console.error("No centre file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", centreFile);

    try {
      const response = await fetch("http://localhost:3001/api/centre/centre", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Centre upload successful", data);
      alert("Centre CSV file uploaded successfully!");
    } catch (error) {
      console.error("Error uploading centre file", error);
      alert("Error in uploading centre file. Check for duplicate entries in CSV.");
    }
  };

  const handleResultUpload = async () => {
    if (!resultFile) {
      console.error("No result file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", resultFile);

    try {
      const response = await fetch("http://localhost:3001/api/uploadcsv/results", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Result upload successful", data);
      alert("Result CSV file uploaded successfully!");
    } catch (error) {
      console.error("Error uploading result file", error);
      alert("Error in uploading result file. Check for duplicate entries in CSV.");
    }
  };

  return (
    <>
      <h1>Upload Registrations and Centres:</h1>
      <div className="upload-container">
        <div className="upload-cards">
          <div>
            <label htmlFor="school">School Name:</label>
            <input type="text" id="school" name="school" onChange={(e) => setSchool(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="studentcount">Student Count (number of students in CSV file):</label>
            <input type="number" id="studentcount" name="studentcount" onChange={(e) => setStudentCount(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="file">Student Registration CSV File Input:</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="button-container">
            <button onClick={handleUpload}>Upload Registrations</button>
          </div>
        </div>
        <div className="upload-cards">
          <h2>Upload Instructions</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit voluptatem nemo neque! Explicabo molestiae, maxime quidem fugiat sapiente enim asperiores culpa obcaecati a voluptatem unde repudiandae omnis provident voluptate atque recusandae alias. Odit, nisi corporis, debitis impedit repudiandae eveniet adipisci accusamus dolores tenetur nesciunt sunt cum provident nemo quia? Dolor.</p>
        </div>
      </div>
      <div className="upload-container">
        <div className="upload-cards">
          <div>
            <label htmlFor="centreFile">Centre CSV File Input:</label>
            <input
              type="file"
              id="centreFile"
              name="centreFile"
              onChange={handleCentreFileChange}
              required
            />
          </div>

          <div className="button-container">
            <button onClick={handleCenterUpload}>Upload Centre CSV</button>
          </div>
        </div>
        <div className="upload-cards">
          <h2>Centre Upload Instructions</h2>
          <p>Instructions for uploading centre CSV file.</p>
        </div>
      </div>
      <div className="upload-container">
        <div className="upload-cards">
          <div>
            <label htmlFor="resultFile">Result CSV File Input:</label>
            <input
              type="file"
              id="resultFile"
              name="resultFile"
              onChange={handleResultFileChange}
              required
            />
          </div>

          <div className="button-container">
            <button onClick={handleResultUpload}>Upload Result CSV</button>
          </div>
        </div>
        <div className="upload-cards">
          <h2>Result Upload Instructions</h2>
          <p>Instructions for uploading result CSV file.</p>
        </div>
      </div>
    </>
  );
};

export default Upload;
