import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/users/login", {
        email,
        password
      });

      setSuccess("Login Successful");
      localStorage.setItem("token", response.data.access_token); // Save Token
      setTimeout(() => navigate("/"), 1000); //Redirect to home page after 1 sec

    } catch (err) {
      setError(err.response?.data?.error || "Login Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-card'>
        <h1 className='login-title'>Login</h1>
        
        {/* Display Success or Error Messages */}
        {error && <p className='error-message'>{error}</p>}
        {success && <p className='success-message'>{success}</p>}
        
        <form onSubmit={handleLogin} className='login-form'>
          <div className='form-group'>
            <label htmlFor="email" className='label'>Email</label>
            <input type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='input'
            />
          </div>

          <div className='form-group'>
            <label htmlFor="password" className='label'>Password</label>
            <input type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='input'
            />
          </div>

          <p className='register-text'>Don't have an account? <Link to="/register" className='link'>Register</Link></p>

          <button type="submit" disabled={loading} className='login-button'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
