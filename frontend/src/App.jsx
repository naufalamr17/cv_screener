import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import KeywordInput from './components/KeywordInput';
import ResultsList from './components/ResultsList';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScreening = async () => {
    if (files.length === 0 || keywords.length === 0) {
      alert("Please upload files and add keywords first.");
      return;
    }

    setLoading(true);
    setResults([]); // Clear previous results
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('keywords', keywords.join(','));

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("Backend response:", data); // Debug log

      if (data.results && data.results.length === 0) {
        alert("No results returned from backend. Please check if the CVs are readable.");
      }

      setResults(data.results);
    } catch (error) {
      console.error("Screening Error:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {loading && <LoadingSpinner />}

      <header className="app-header">
        <h1>🚀 CV Screener AI</h1>
        <p>Upload CVs, set keywords, and find the best candidates instantly.</p>
      </header>

      <main className="app-main">
        <div className="input-section">
          <FileUpload onFilesSelected={setFiles} />
          <KeywordInput onKeywordsChange={setKeywords} />

          <div className="action-area">
            <button
              className="screen-btn"
              onClick={handleScreening}
              disabled={loading || files.length === 0 || keywords.length === 0}
            >
              Start Screening
            </button>
          </div>
        </div>

        <ResultsList results={results} />
      </main>
    </div>
  );
}

export default App;
