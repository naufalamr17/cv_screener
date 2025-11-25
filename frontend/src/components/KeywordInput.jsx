import React, { useState } from 'react';
import './KeywordInput.css';

const KeywordInput = ({ onKeywordsChange }) => {
    const [input, setInput] = useState('');
    const [keywords, setKeywords] = useState([]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            addKeyword(input.trim());
        }
    };

    const addKeyword = (keyword) => {
        if (!keywords.includes(keyword)) {
            const newKeywords = [...keywords, keyword];
            setKeywords(newKeywords);
            onKeywordsChange(newKeywords);
        }
        setInput('');
    };

    const removeKeyword = (keywordToRemove) => {
        const newKeywords = keywords.filter(k => k !== keywordToRemove);
        setKeywords(newKeywords);
        onKeywordsChange(newKeywords);
    };

    return (
        <div className="keyword-input-container">
            <h3>Target Keywords</h3>
            <div className="keyword-input-wrapper">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type keyword and press Enter..."
                    className="keyword-input"
                />
                <button
                    type="button"
                    onClick={() => input.trim() && addKeyword(input.trim())}
                    className="add-keyword-btn"
                >
                    Add
                </button>
            </div>
            <div className="keywords-list">
                {keywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag">
                        {keyword}
                        <button onClick={() => removeKeyword(keyword)} className="remove-keyword-btn">×</button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default KeywordInput;
