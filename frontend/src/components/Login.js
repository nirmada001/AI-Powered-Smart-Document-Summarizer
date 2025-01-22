import React, {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e)=>{
        e.preventDefault();
        setError("");
        setSuccess("");

        try{
            const response = await axios.post("http://127.0.0.1:5000/api/users/login",{
                email,
                password
            });

            setSuccess("Login Successful");
            localStorage.setItem("token", response.data.access_token); // Save Token
            setTimeout(()=>navigate("/"), 1000); //Redirect to home page after 1 sec

        }catch(err){
            setError(err.response?.data?.error || "Login Failed. Try agin.");
        }
    };
  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  )
}

export default Login