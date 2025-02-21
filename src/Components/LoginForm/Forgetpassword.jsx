import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig"; 
import background from '../../assets/background.jpg';
import './LoginForm.css';

const ForgetPassword = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Check Your Gmail");
      })
      .catch((err) => {
        alert(err.code);
      });
  };

  return (
    <div className="forget">
      <img src={background} className="background fade-in" alt="" />
      <form onSubmit={handleSubmit} className="forget-form">
        <h1>Forget Password</h1>
        <input type="text" name="email" placeholder="Enter your email" />
        <button type="submit">Reset</button>
      </form>
    </div>
  );
};

export default ForgetPassword;