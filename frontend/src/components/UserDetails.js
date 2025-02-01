import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import "../css/userdetails.css"; // CSS for styling

const UserDetails = () => {
  //get user details and display them
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async() =>{
      const token = localStorage.getItem('token');
      if(!token){
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:5000/api/users/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      }catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }

    }
    fetchUserDetails();
  },[navigate]);
  return (
    <div className="user-details-container">
      <h2>User Profile</h2>

      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <p><strong>Name:</strong> {user.name || "N/A"}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</p>
        </div>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
};

export default UserDetails