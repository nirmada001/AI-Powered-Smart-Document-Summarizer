import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons
import "../css/navbar.css"; // Make sure to create a CSS file for styling

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">AI Summarizer</Link>
      </div>
      
      <div className="hamburger" onClick={() => setIsMobile(!isMobile)}>
        {isMobile ? <FaTimes /> : <FaBars />}
      </div>
      
      <ul className={isMobile ? "nav-links-mobile" : "nav-links"} onClick={() => setIsMobile(false)}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/summarizer">Summarizer</Link>
        </li>
        <li>
          <Link to="/userdetails">Profile</Link>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
