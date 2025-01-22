import React, {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e)=>{
        e.preventDefault();
        setError("");
        setSuccess("");

        try{
            await axios.post("http://127.0.0.1:5000/api/users/register",{
                name,
                email,
                password
            });

            setSuccess("Registration Successful");
            setTimeout(()=>navigate("/login"), 1000); //Redirect to login page after 1 sec

        }catch(err){
            setError(err.response?.data?.error || "Registration Failed. Try agin.");
        }
    
    };
  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  )
}

export default Register