import React from 'react';
import "../css/footer.css"; // Ensure to create the CSS file for styling

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>&copy; 2025 AI Summarizer. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
          <a href="/terms-of-service" className="footer-link">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
