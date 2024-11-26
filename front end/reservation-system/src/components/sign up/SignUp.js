import React from 'react'
import { useState } from 'react';
import './signup.css' 
import { FaUser } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
export const SignUp = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
      });
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    //   const handleSubmit = (e) => {
    //     e.preventDefault(); // Prevent form refresh
    //     console.log(formData); // Log the form data
    //   };
  return (
    <div className='signup'> <form action=""> 
            <h1>Sign Up</h1>
            <div className='input-box'>
                <input type='text'
            name='username'
            placeholder='Username'
            value={formData.username}
            onChange={handleChange}
            required
             /> 
             <FaUser className='icon' />
            </div>
            <div className='input-box'>
                <input type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            required
             />
              <MdOutlineAlternateEmail className='icon'/>
            </div>
            <div className='input-box'>
                <input type='password'
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
             /> <RiLockPasswordFill className='icon'/>
            </div>
            <button type='submit'> Sign Up</button>
        </form>
     </div>
  )
}
export default SignUp;
