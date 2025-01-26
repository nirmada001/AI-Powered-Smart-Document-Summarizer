import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import '../css/register.css'


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:5000/api/users/register", {
        name,
        email,
        password
      });

      setSuccess("Registration Successful");
      setTimeout(() => navigate("/login"), 1000); //Redirect to login page after 1 sec

    } catch (err) {
      setError(err.response?.data?.error || "Registration Failed. Try agin.");
    }

  };
  return (
    <div className='main-div'>
      <div className='register-div'>
        <h1 className='title'>Register</h1>
        {error && <p className='error-message'>{error}</p>}
        {success && <p className='success-message'>{success}</p>}
        <form onSubmit={handleRegister}>
          <div className='form-group'>
            <label htmlFor="name" className='label'>Name</label><br />
            <input type="text"
              placeholder="Name"
              value={name} onChange={(e) => setName(e.target.value)}
              required
              className='input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="email" className='label'>Email</label><br />
            <input type="email"
              placeholder="Email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required
              className='input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="password" className='label'>Password</label><br />
            <input type="password"
              placeholder="Password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required
              className='input'
            />
          </div>
          <p>Already have an account? <Link to="/login" className='Link'>Login</Link></p>
          <button type="submit" disabled={loading} className='register-button'>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register