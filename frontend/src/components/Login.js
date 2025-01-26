import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import '../css/login.css'


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
      setError(err.response?.data?.error || "Login Failed. Try agin.");
    }
  };
  return (
    <div className='main-div'>
      <div className='login-div'>
        <h1 className='title'>Login</h1>
        {error && <p className='error-message'>{error}</p>}
        {success && <p className='success-message'>{success}</p>}
        <form onSubmit={handleLogin}>
          <div className='form-group'>
            <label htmlFor="email" className='label'>Email</label><br />
            <input type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="passowrd" className='label'>Password</label><br />
            <input type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='input'
            />
          </div>
          <p>Don't have an account? <Link to="/register" className='Link'>Register</Link></p>
          <button type="submit" disabled={loading} className='login-button'>
            {loading ? 'Loging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login



