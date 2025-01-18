import React, { useState } from "react";
import axios from "axios";

const Summarizer = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);

  const handleSummarize = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/summarize", { text });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error summarizing text:", error);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h2>AI Document Summarizer</h2>

      {/* Text Summarization */}
      <textarea
        rows="4"
        cols="50"
        placeholder="Enter text to summarize..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSummarize}>Summarize Text</button>

      {/* File Upload */}
      <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload}>Upload & Summarize</button>

      {/* Summary Output */}
      {summary && (
        <div>
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default Summarizer;
