import React from "react";
import "../styles/auth.css";
import axios  from "axios";
import { useNavigate } from "react-router-dom";

const PartnerLogin = () => {


   const navigate = useNavigate();

   const handlesubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value; 
    const response = await axios.post("http://localhost:3000/api/auth/food-partner/login", {
      email,
      password,
    }, {withCredentials: true});


    console.log(response.data);

    navigate("/create-food");
 }
 
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand">FoodReels</div>
        <h2 className="title">Partner sign in</h2>
        <p className="subtitle">Access your partner dashboard and orders.</p>

        <form className="auth-form" onSubmit={handlesubmit}>
          <label>
            Email
            <input name="email" type="email" placeholder="partner@example.com" />
          </label>

          <label>
            Password
            <input name="password" type="password" placeholder="Enter your password" />
          </label>

          <button className="btn primary" type="submit">
            Sign in
          </button>
        </form>

        <div className="auth-foot">
          Don't have an account? <a href="/food-partner/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;
