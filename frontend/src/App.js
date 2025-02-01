// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Summarizer from "./components/Summarizer";
import UserDetails from "./components/UserDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/summarizer" element={<Summarizer />} />
        <Route path="/userdetails" element={<UserDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
