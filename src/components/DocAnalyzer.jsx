import React, { useState } from 'react';
import axios from 'axios';
import './DocAnalyzer.css'; // Optional: Create a CSS file for styling

const DocAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await axios.post('http://localhost:5000/api/documents/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSummary(res.data.summary);
    } catch (err) {
      console.error('Error analyzing document:', err);
    }
  };

  return (
    <div className="doc-analyzer-container">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} required />
        <button type="submit">Analyze Document</button>
      </form>
      {summary && (
        <div>
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default DocAnalyzer;