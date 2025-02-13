import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "../css/summaryDetails.css";

const SummaryDetails = () => {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://127.0.0.1:5000/api/summarization/summary/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [id]);

  const handleDownload = async (format) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:5000/api/summarization/summary/download/${id}?format=${format}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `summary.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading summary:", error);
    }
  };

  return (
    <div className="summary-details-container">
      <Navbar />
      <h2>Summary Details</h2>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : summary ? (
        <div className="summary-info">
          <p><strong>Title:</strong> {summary.title}</p>
          <p><strong>Tone:</strong> {summary.summaryTone}</p>

          <div className="summary-content">
            <div className="text-box original-text">
              <h3>Original Text</h3>
              <p>{summary.original_text}</p>
            </div>
            <div className="text-box summary-text">
              <h3>Summary ({summary.summary_length})</h3>
              <p>{summary.summary}</p>
            </div>
          </div>

          <div className="download-buttons">
            <button onClick={() => handleDownload("txt")}>Download as TXT</button>
            <button onClick={() => handleDownload("docx")}>Download as DOCX</button>
            <button onClick={() => handleDownload("pdf")}>Download as PDF</button>
          </div>

          <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      ) : (
        <p>Summary not found.</p>
      )}
    </div>
  );
};

export default SummaryDetails;
