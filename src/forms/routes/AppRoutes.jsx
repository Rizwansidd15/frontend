import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserRegister from "../UserRegister";
import UserLogin from "../UserLogin";
import PartnerRegister from "../PartnerRegister";
import PartnerLogin from "../PartnerLogin";
import Home from "../../pages/Home";
import Profile from "../../pages/Profile";
import CreateFood from "../../pages/CreateFood";
import Saved from "../../pages/Saved";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<PartnerRegister />} />
        <Route path="/food-partner/login" element={<PartnerLogin />} />
        <Route path="/" element={<UserRegister />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/create-food" element={<CreateFood />} />
        <Route path="/saved" element={<Saved />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
