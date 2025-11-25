import React from 'react';
import './ResultsList.css';

const ResultsList = ({ results }) => {
    if (!results || results.length === 0) {
        return null;
    }

    return (
        <div className="results-container">
            <h3>Screening Results</h3>
            <div className="results-grid">
                {results.map((result, index) => (
                    <div key={index} className={`result-card ${result.score > 0 ? 'match' : 'no-match'}`}>
                        <div className="result-header">
                            <span className="filename">{result.filename}</span>
                            <span className="score-badge">Matches: {result.score}</span>
                        </div>
                        {result.error ? (
                            <div className="result-error">Error: {result.error}</div>
                        ) : (
                            <>
                                <div className="matched-keywords">
                                    {result.matches && result.matches.map((match, i) => (
                                        <span key={i} className="match-tag">{match}</span>
                                    ))}
                                </div>
                                <div className="snippet">
                                    <p>...{result.snippet}...</p>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResultsList;
