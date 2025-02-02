import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [summaries, setSummaries] = useState([]);  // Store summaries
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user details
        const userResponse = await axios.get("http://127.0.0.1:5000/api/users/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        // Fetch user summaries
        const summariesResponse = await axios.get("http://127.0.0.1:5000/api/summarization/SummariesHistory", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSummaries(summariesResponse.data.summaries || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="user-details-container">
      <h2>User Profile</h2>

      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <p><strong>Name:</strong> {user.name || "N/A"}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</p>

          <h3>Summarization History</h3>
          {summaries.length > 0 ? (
            <ul>
              {summaries.map((summary) => (
                <li key={summary._id}>
                  <p><strong>Original Text:</strong> {summary.original_text}</p>
                  <p><strong>Summary:</strong> {summary.summary}</p>
                  <p><strong>Length:</strong> {summary.summary_length}</p>
                  <p><strong>Date:</strong> {new Date(summary.created_at).toLocaleDateString()}</p>
                  <hr />
                </li>
              ))}
            </ul>
          ) : (
            <p>No summaries found.</p>
          )}
        </div>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
};

export default UserDetails;
