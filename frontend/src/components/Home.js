import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);  // Debugging

                // Extract `sub` where user details are stored
                const userData = decodedToken.sub;
                console.log("Extracted User Data:", userData);

                setUser(userData);
            } catch (error) {
                console.error('Invalid token', error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);  


    return (
        <div>
            <Navbar />
            <h1>Welcome {user ? user.name || 'Guest' : 'Guest'} to AI Document Summarizer</h1>
            
            <Footer />
        </div>
    );
};

export default Home;
