import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const AdmitCard = () => {
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/api/" : "http://localhost:3001/api/";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const downloadPdf = async (roll) => {
    try {
      const res = await axios.get(`${baseURL}uploadcsv/fetch-pdf/${roll}`, { responseType: 'blob' });
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      saveAs(pdfBlob, `${roll}_Technothlon-2024.pdf`);
    } catch (error) {
      console.error(`Error downloading PDF for roll ${roll}`, error);
    }
  };

  const createPdfs = async () => {
    setLoading(true);
    setMessage('Generating PDFs...');
    
    try {
      const response = await axios.post(`${baseURL}uploadcsv/create-pdf`);
      setMessage(response.data.message);
      
      // Download each generated PDF
      for (const roll of response.data.pdfs) {
        await downloadPdf(roll);
      }

      setMessage('All PDFs downloaded successfully');
    } catch (error) {
      console.error('Error creating PDFs:', error);
      setMessage('Error creating PDFs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AdmitCard-main main">
      <div className="admitCard">
        <h2>Generate Admit Cards</h2>
        <button
          onClick={createPdfs}
          disabled={loading}
          style={{
            backgroundColor: loading ? 'gray' : 'green',
            color: 'white',
            height: '50px',
            width: '200px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '40px'
          }}
        >
          {loading ? 'Generating...' : 'Generate Admit Cards'}
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default AdmitCard;
