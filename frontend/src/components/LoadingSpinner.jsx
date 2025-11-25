import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Screening CVs...</p>
        <small>Analyzing text and images</small>
      </div>
    </div>
  );
};

export default LoadingSpinner;
