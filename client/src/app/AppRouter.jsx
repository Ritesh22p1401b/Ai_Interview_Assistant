// src/app/AppRouter.jsx

import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import UploadResume from "../pages/UploadResume";
import Interview from "../pages/Interview";
import Result from "../pages/Result";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/interview/:id" element={<Interview />} />
          <Route path="/result/:id" element={<Result />} />
        </Route>
      </Route>
    </Routes>
  );
}