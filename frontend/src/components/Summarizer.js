import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/summarizer.css"; // Ensure CSS file exists
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";

const Summarizer = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const [summaryLength, setSummaryLength] = useState("medium"); // Default to Medium
  const [summaryTone, setSummaryTone] = useState("professional"); // Default to professional
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");  // Add title state
  const [tone, setTone] = useState("");  // Add tone state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.sub);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSummarize = async () => {
    if (!text.trim()) {
      alert("Please enter text to summarize");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:5000/api/summarization/summarize",
        { text, summary_length: summaryLength, summary_tone: summaryTone },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      setSummary(response.data.summary);
      setTitle(response.data.title);
      setTone(response.data.summary_tone);
    } catch (error) {
      console.error("Error summarizing text:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("summary_length", summaryLength);
    formData.append("summary_tone", summaryTone);

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:5000/api/summarization/upload",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setSummary(response.data.summary);
      setTitle(response.data.title);
      setTone(response.data.summary_tone);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summarizer-container">
      <Navbar />
      <h2>AI Document Summarizer</h2>

      {/* Summary Length Selection */}
      <div className="summary-options">
        <button
          className={summaryLength === "short" ? "active" : ""}
          onClick={() => setSummaryLength("short")}
        >
          Short
        </button>
        <button
          className={summaryLength === "medium" ? "active" : ""}
          onClick={() => setSummaryLength("medium")}
        >
          Medium
        </button>
        <button
          className={summaryLength === "detailed" ? "active" : ""}
          onClick={() => setSummaryLength("detailed")}
        >
          Detailed
        </button>
      </div>
      {/* Summary Tone Selection */}
      <div className="summary-options">
        <button
          className={summaryTone === "professional" ? "active" : ""}
          onClick={() => setSummaryTone("professional")}
        >
          Professional
        </button>
        <button
          className={summaryTone === "casual" ? "active" : ""}
          onClick={() => setSummaryTone("casual")}
        >
          Casual
        </button>
        <button
          className={summaryTone === "academic" ? "active" : ""}
          onClick={() => setSummaryTone("academic")}
        >
          Academic
        </button>
      </div>

      {/* Text Summarization */}
      <textarea
        rows="4"
        cols="50"
        placeholder="Enter text to summarize..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "Summarizing..." : "Summarize Text"}
      </button>

      {/* File Upload */}
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleFileUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload & Summarize"}
      </button>

      {/* Summary Output */}
      {summary ? (
        <div className="summary-output">
          <h3>📌 Title: {title}</h3>
          <h3>Summary Length: {summaryLength}</h3>
          <h3>Tone: {summaryTone}</h3>
          <p>{summary}</p>
        </div>
      ) : (
        <p style={{ fontStyle: "italic", color: "gray" }}>No summary yet. Enter text or upload a file.</p>
      )}

    </div>
  );
};

export default Summarizer;
