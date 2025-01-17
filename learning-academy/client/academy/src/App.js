import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Register from "./components/Register";
import "./App.css";
import Home from "./components/Home";
import Professor from "./components/Professor";
import StudentLogin from "./components/StudentLogin";
import StudentRegister from "./components/StudentRegister";
import Student from "./components/Student";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/register" element={<Register />} />
        <Route path="/professor" element={<Professor />} />
        <Route path="/student" element={<Student />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-register" element={<StudentRegister />} />
      </Routes>
    </>
  );
};

export default App;

