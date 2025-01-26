import React, { useState } from "react";
import classes from "./Signup.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    City: "",
    Address: "",
    emailAddress: "",
    role: "Admin",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("Form submitted:", formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
      const body = {
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        gender: formData.gender,
        City: formData.City,
        Address: formData.Address,
        emailAddress: formData.emailAddress,
        role: formData.role,
      };

      // alert(`Request body: ${JSON.stringify(body, null, 2)}`);

      const response = await axios.post("http://localhost:3000/signup", body);
      if (response.status === 201 || response.status === 200) {
        console.log("Sign up successfully!", response.data);
        console.log("Token",response.data.token)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", response.data.user.role); 
        navigate("/");
        window.location.reload();
      } else {
        console.error("Error signing up:", response.data.errorMessage);
        alert(response.data.errorMessage);
      }
    } catch (error) {
      console.error("Error: ", error);
      alert(error.response.data.error);
    }
  };

  return (
    <div className={classes.form_container}>
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <div className={classes.signinlink}>
          <span>Already have one?</span>
          <a href="/Signin">Signin</a>
        </div>
        <div className={classes.form_group}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <br />
        <div className={classes.form_group}>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <br />
        <div className={classes.form_group}>
          <input
            type="date"
            name="birthDate"
            placeholder="Birth Date"
            value={formData.birthDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <br />
        <div className={classes.form_group}>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <br />
        <div className={classes.form_group}>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="Fan">Fan</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <br />
        <div className={classes.form_group}>
          <input
            type="text"
            name="City"
            placeholder="City"
            value={formData.City}
            onChange={handleInputChange}
            required
          />
        </div>
        <br />
        <div className={classes.form_group}>
          <input
            type="text"
            name="Address"
            placeholder="Address"
            value={formData.Address}
            onChange={handleInputChange}
          />
        </div>
        <br />
        <div className={classes.form_group}>
          <input
            type="email"
            name="emailAddress"
            placeholder="Email"
            value={formData.emailAddress}
            onChange={handleInputChange}
            required
          />
        </div>
        <br />
        <div className={classes.form_group}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <br />
        <div className={classes.form_group}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <br />
        <button type="submit">Create account</button>
      </form>
    </div>
  );
};

export default Signup;
