// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Summarizer from "./components/Summarizer";
import UserDetails from "./components/UserDetails";
import SummaryDetails from "./components/SummaryDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/summarizer" element={<Summarizer />} />
        <Route path="/userdetails" element={<UserDetails />} />
        <Route path="/summary/:id" element={<SummaryDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
