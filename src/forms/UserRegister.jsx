import React, { useState } from "react";
import "../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();
    setError("");
    const fullname = e.target.fullname.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        "https://backend2-xw64.onrender.com/api/auth/user/register",
        {
          fullname,
          email,
          password,
        },
        { withCredentials: true },
      );

      console.log(response.data);
      navigate("/home");
    } catch (err) {
      console.error("Register error", err);
      const msg =
        err.response?.data?.messege ||
        err.response?.data?.message ||
        err.message;
      setError(msg || "Registration failed");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand">FoodReels</div>
        <h2 className="title">Create your account</h2>
        <p className="subtitle">
          Sign up to discover and order from nearby food partners.
        </p>

        <form className="auth-form" onSubmit={handlesubmit}>
          <label>
            Full name
            <input name="fullname" type="text" placeholder="Jane Doe" />
          </label>

          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" />
          </label>

          <div className="field-row">
            <label>
              Password
              <input
                name="password"
                type="password"
                placeholder="Create password"
              />
            </label>
          </div>

          <button className="btn primary" type="submit">
            Create account
          </button>
        </form>

        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}

        <div className="auth-foot">
          Already have an account? <a href="/user/login">Sign in</a>
        </div>

        <div
          style={{ marginTop: 8, textAlign: "center", color: "var(--muted)" }}
        >
          Are you a food partner?{" "}
          <a
            href="/food-partner/register"
            style={{ color: "var(--accent-2)", fontWeight: 600 }}
          >
            Register as partner
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
