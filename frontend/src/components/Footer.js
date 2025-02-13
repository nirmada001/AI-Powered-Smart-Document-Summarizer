import React from 'react';
import "../css/footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>&copy; 2025 AI Summarizer. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
