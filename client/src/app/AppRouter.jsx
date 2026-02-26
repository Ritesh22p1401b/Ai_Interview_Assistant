// src/app/AppRouter.jsx

import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import UploadResume from "../pages/UploadResume";
import Interview from "../pages/Interview";
import Result from "../pages/Result";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import DesignLab from "../pages/DesignLab";


export default function AppRouter() {
  return (
    <Routes>

      {/* Layout wraps ALL pages → Navbar everywhere */}
      <Route element={<Layout />}>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/design-lab" element={<DesignLab />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/interview/:id" element={<Interview />} />
          <Route path="/result/:id" element={<Result />} />
        </Route>

      </Route>

    </Routes>
  );
}