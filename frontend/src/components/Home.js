import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/home.css"; // Import custom CSS

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);

                const userData = decodedToken.sub; // Extract user details
                console.log("Extracted User Data:", userData);

                setUser(userData);
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
                        Start Summarizing 🚀
                    </button>
                </div>
            </header>

            {/* Features Section */}
            <section className="features">
                <h2>Why Use Our AI Summarizer?</h2>
                <div className="feature-grid">
                    <div className="feature">
                        <h3>⚡ Instant Summaries</h3>
                        <p>Get real-time summaries as you type.</p>
                    </div>
                    <div className="feature">
                        <h3>📄 File Upload Support</h3>
                        <p>Summarize PDFs, DOCX, and text files effortlessly.</p>
                    </div>
                    <div className="feature">
                        <h3>🎨 Customizable Length & Tone</h3>
                        <p>Choose between short, medium, and detailed summaries.</p>
                    </div>
                    <div className="feature">
                        <h3>🌍 Multilingual Support</h3>
                        <p>Summarize text in multiple languages.</p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <h3>1️⃣ Upload or Paste Text</h3>
                        <p>Copy-paste text or upload documents for summarization.</p>
                    </div>
                    <div className="step">
                        <h3>2️⃣ Select Preferences</h3>
                        <p>Choose summary length and tone.</p>
                    </div>
                    <div className="step">
                        <h3>3️⃣ Get Instant Summary</h3>
                        <p>View the AI-generated summary in seconds.</p>
                    </div>
                </div>
            </section>

            {/* Testimonial Section
            <section className="testimonials">
                <h2>What Our Users Say</h2>
                <div className="testimonial">
                    <p>“This summarizer saved me hours of work! The real-time updates are a game-changer.”</p>
                    <span>- Alex, Researcher</span>
                </div>
                <div className="testimonial">
                    <p>“I love the customizable summary tones. Perfect for students and professionals alike.”</p>
                    <span>- Sarah, Student</span>
                </div>
            </section> */}

            <Footer />
        </div>
    );
};

export default Home;
