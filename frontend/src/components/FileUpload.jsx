import React, { useState, useRef } from 'react';
import './FileUpload.css'; // We'll create this later or put styles in index.css

const FileUpload = ({ onFilesSelected }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    setFiles(prev => [...prev, ...newFiles]);
    onFilesSelected(newFiles);
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="file-upload-container">
      <form 
        className={`file-upload-form ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
        onSubmit={(e) => e.preventDefault()}
      >
        <input 
          ref={inputRef} 
          type="file" 
          className="file-upload-input" 
          multiple 
          accept=".pdf"
          onChange={handleChange} 
        />
        <div className="upload-content">
          <div className="upload-icon">📄</div>
          <p>Drag & Drop CVs here or</p>
          <button type="button" className="upload-btn" onClick={onButtonClick}>Browse Files</button>
        </div>
      </form>
      {files.length > 0 && (
        <div className="file-list">
          <h4>Selected Files ({files.length}):</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
