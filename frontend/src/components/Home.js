import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/home.css";

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);

                // Check if the token is expired
                const currentTime = Date.now() / 1000; // Convert to seconds
                if (decodedToken.exp < currentTime) {
                    console.warn("Token expired. Redirecting to login.");
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                setUser(decodedToken.sub); // Extract user details
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem("token");
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="home-container">
            <Navbar />

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <h1>Welcome, {user ? user.name || "Guest" : "Guest"}!</h1>
                    <p>Effortlessly Summarize Documents with AI</p>
                    <button onClick={() => navigate("/summarizer")} className="cta-button">
                        Start Summarizing
                    </button>
                </div>
            </header>

            {/* Features Section */}
            <section className="features">
                <h2>Why Use Our AI Summarizer?</h2>
                <div className="feature-grid">
                    <div className="feature">
                        <h3>Instant Summaries</h3>
                        <p>Get real-time summaries as you type.</p>
                    </div>
                    <div className="feature">
                        <h3>File Upload Support</h3>
                        <p>Summarize PDFs, DOCX, and text files effortlessly.</p>
                    </div>
                    <div className="feature">
                        <h3>Customizable Length & Tone</h3>
                        <p>Choose between short, medium, and detailed summaries.</p>
                    </div>
                    <div className="feature">
                        <h3>Multilingual Support</h3>
                        <p>Summarize text in multiple languages.</p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <h3>Upload or Paste Text</h3>
                        <p>Copy-paste text or upload documents for summarization.</p>
                    </div>
                    <div className="step">
                        <h3>Select Preferences</h3>
                        <p>Choose summary length and tone.</p>
                    </div>
                    <div className="step">
                        <h3>Get Instant Summary</h3>
                        <p>View the AI-generated summary in seconds.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
