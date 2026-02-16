import React, { useState } from "react";
import "../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PartnerRegister = () => {
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState(null);

  const handlesubmit = async (e) => {
    e.preventDefault();
    // Implement partner registration logic here

    const fullname = e.target.fullname.value;
    const businessname = e.target.businessname.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;
    const uploadProfilePicture = avatarFile ? true : false;

    const response = await axios.post(
      "http://localhost:3000/api/auth/food-partner/register",
      {
        fullname,
        businessname,
        email,
        phone,
        password,
        uploadProfilePicture
      },
      { withCredentials: true },
    );

    console.log(response.data);
    // if an avatar was chosen, upload it now (server sets partner cookie on register)
    if (avatarFile) {
      try {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        await axios.post(
          "http://localhost:3000/api/auth/food-partner/avatar",
          fd,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      } catch (err) {
        console.error("failed to upload partner avatar", err);
      }
    }

    navigate("/create-food");
  };
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand">FoodReels</div>
        <h2 className="title">Partner onboarding</h2>
        <p className="subtitle">
          Create your partner account to start receiving orders.
        </p>

        <form className="auth-form" onSubmit={handlesubmit}>
          <label>
            full name
            <input name="fullname" type="text" placeholder="Alex Partner" />
          </label>

          <label>
            Business name
            <input name="businessname" type="text" placeholder="Tasty Bites" />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              placeholder="business@example.com"
            />
          </label>

          <div className="field-row">
            <label>
              Phone
              <input name="phone" type="tel" placeholder="+1 (555) 555-5555" />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                placeholder="Create password"
              />
            </label>
          </div>

          <label>
            Profile photo (optional)
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setAvatarFile(e.target.files && e.target.files[0])
              }
            />
          </label>

          <button className="btn primary" type="submit">
            Register as partner
          </button>
        </form>

        <div className="auth-foot">
          Already registered? <a href="/food-partner/login">Sign in</a>
        </div>

        <div
          style={{ marginTop: 8, textAlign: "center", color: "var(--muted)" }}
        >
          Looking for a user account?{" "}
          <a
            href="/user/register"
            style={{ color: "var(--accent-2)", fontWeight: 600 }}
          >
            Register as user
          </a>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;
