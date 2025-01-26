import React, { useState } from "react";
import "./LoginSignup.css";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Login() {
  const action = "Login";
  const navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const body = {
        emailAddress: emailAddress,
        password: password,
      };

      // Make the API request to the login endpoint
      const response = await axios.post("http://localhost:3000/login", body);

      // Check if the request was successful
      if (response.status === 200 || response.status === 201) {
        console.log("Login successfully!", response.data);

        // Store token and user role in local storage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", response.data.user.role);

        // Redirect to the home page
        navigate("/");
        window.location.reload();
      } else {
        console.error("Login failed:", response.statusText);
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.response?.data?.errorMessage || "An error occurred during login.");
    }
  };

  return (
    <div className="loginsignup-container">
      <div className="header">
        <div className="text">
          <h2>{action}</h2>
        </div>
        <div className="signinlink">
          <span className="span_new">New? </span>
          <a href="/Signup">Create an account</a>
        </div>
      </div>
      <div className="inputs">
        <div className="input">
          <FaUser className="icon" />
          <input
            type="email"
            placeholder="Email Address"
            onChange={(event) => setEmailAddress(event.target.value)}
            value={emailAddress}
            required
          />
        </div>
        <div className="input">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            required
          />
        </div>
      </div>
      <div className="forgot-password">
        Forgot your password?
      </div>
      <div className="submit-container">
        <div
          className={emailAddress && password ? "submit" : "submit gray"}
          onClick={handleLogin}
        >
          Sign in
        </div>
      </div>
    </div>
  );
}

export default Login;
