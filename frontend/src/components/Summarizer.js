import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/summarizer.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Summarizer = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        // Extract user ID from the token (modify based on actual token structure)
        const userId = decodedToken.sub;
        console.log("User ID:", userId);

        setUser(userId);
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
      setError("Please enter text to summarize.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:5000/summarize",
        { text, user_id: user }, // Send user ID to backend
        { headers: { Authorization: `Bearer ${token}` } } // Attach token
      );

      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error summarizing text:", error);
      setError("Failed to summarize text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return alert("Please select a file");
  
    const formData = new FormData();
    formData.append("file", file);
  
    const token = localStorage.getItem("token"); // Retrieve token
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": token // Send token in Authorization header
        },
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
      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "Summarizing..." : "Summarize Text"}
      </button>

      {/* File Upload */}
      <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload & Summarize"}
      </button>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
