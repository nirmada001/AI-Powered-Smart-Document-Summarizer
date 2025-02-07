import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "../css/summaryDetails.css";

const SummaryDetails = () => {
  const { id } = useParams(); // Get summary ID from URL
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

  return (
    <div className="summary-details-container">
      <Navbar />
      <h2>Summary Details</h2>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : summary ? (
        <div className="summary-info">
          <p><strong>Title:</strong> {summary.title}</p>
          <p><strong>Created At:</strong> {new Date(summary.created_at).toLocaleDateString()}</p>
          <p><strong>Tone:</strong> {summary.tone}</p>
          <p><strong>Original Text:</strong> {summary.original_text}</p>
          <p><strong>Summary ({summary.summary_length}):</strong> {summary.summary}</p>

          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      ) : (
        <p>Summary not found.</p>
      )}
    </div>
  );
};

export default SummaryDetails;
