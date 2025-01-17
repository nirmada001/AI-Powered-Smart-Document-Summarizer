import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/`)
      .then(response => setMessage(response.data.message))
      .catch(error => console.error("Error fetching API:", error));
  }, []);

  return (
    <div>
      <h1>AI Document Summarizer</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
