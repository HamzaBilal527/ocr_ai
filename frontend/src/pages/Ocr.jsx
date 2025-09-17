import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Ocr.css';

const Ocr = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(false);
  const [typedTitle, setTypedTitle] = useState('');

  const fullTitle = '📝 Image to Text Extractor';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedTitle(fullTitle.slice(0, index + 1));
      index++;
      if (index === fullTitle.length) {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image first.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await axios.post('/api/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setText(res.data.text);
      // console.log(res);
    } catch (err) {
      console.error(err);
      alert('Image is not clear. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback without changing functionality
    }
  };

  return (
    <div className="ocr-container">
      <h1 className="typing-title" aria-live="polite">{typedTitle}</h1>

      <div className="content-container">
        <div className="upload-section" aria-busy={loading ? 'true' : 'false'}>
          {preview && (
            <img
              src={preview}
              alt="Selected preview"
              className="image-preview"
            />
          )}

          <label htmlFor="file-upload" className="custom-file-upload">
            {selectedFile ? selectedFile.name : 'Choose Image'}
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            aria-disabled={loading ? 'true' : 'false'}
            className="primary-action"
          >
            {loading ? 'Processing...' : 'Upload & Extract'}
          </button>
        </div>

        <div className="result-container">
          <h2>Extracted Text</h2>
          <p aria-live="polite">
            {text || 'No text extracted yet.'}
          </p>
          {text && (
            <button className="copy-button" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ocr;
