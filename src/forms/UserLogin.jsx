import React from 'react'
import '../styles/auth.css'
import axios  from 'axios'
import { useNavigate } from 'react-router-dom'

const UserLogin = ()=>{

  const navigate = useNavigate();

 const handlesubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await axios.post("http://localhost:3000/api/auth/user/login", {
      email,
      password,
    }, {withCredentials: true});

    console.log(response.data);
    
    navigate("/home")
 }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand">FoodReels</div>
        <h2 className="title">Welcome back</h2>
        <p className="subtitle">Sign in to continue to your account.</p>

        <form className="auth-form" onSubmit={handlesubmit}>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input name="password" type="password" placeholder="Enter your password" />
          </label>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <label style={{fontSize:'0.9rem',color:'var(--muted)'}}><input type="checkbox" style={{marginRight:8}}/>Remember me</label>
            <a href="#" style={{color:'var(--accent-2)',fontWeight:600}}>Forgot?</a>
          </div>

          <button className="btn primary" type="submit">Sign in</button>
        </form>

        <div className="auth-foot">New here? <a href="/user/register">Create an account</a></div>
      </div>
    </div>
  )
}

export default UserLogin
