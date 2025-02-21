
import React from 'react';
import './Admin.css';
import profilePicture from '../../assets/profile.jpg';
import { MdOutlineSecurityUpdateWarning } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";

function Profile({ isOpen, onClose }) {
  const userName = "Admin";
  const handleLogout = () => {
     
    window.location.href = "http://localhost:5173/";
  }
  const handleAction = () => {
     
    window.location.href = "https://myaccount.google.com/security-checkup/1?utm_source=ogep_aa_w&utm_medium=am_ep&utm_campaign=safetyexp_mvp&hl=en&pli=1";
  }
  const handleAdd = () => {
     
    window.location.href = "https://accounts.google.com/AddSession?hl=en&continue=https://mail.google.com/mail&service=mail&ec=GAlAFw&authuser=0";
  }

  return (
    <div className={`sidebarprofile ${isOpen ? 'open' : ''}`}>
      <div className="sidebarprofile-content">
      
     
        <div className="centered-content">
        <p className='profileparag'>usersaffairs@gmail.com</p>
          <img src={profilePicture} alt="Profile" className="profile-picture" />
          <p>Hello, {userName}!</p>
          <a href="https://myaccount.google.com/u/1/?hl=en&utm_source=OGB&utm_medium=act"className="settings-link">Manage Your Account</a>
        </div>
      
        
        <div className="top-left-buttons">
           
        <li className="logout-button" onClick={handleAction}>
           <MdOutlineSecurityUpdateWarning className='icon' /> Recommended Actions
           </li>
           <li className="logout-button" onClick={handleAdd}>
           <CiCirclePlus className='icon' /> Add another account
           </li>
          <li className="logout-button" onClick={handleLogout}>Logout</li>
          <li onClick={onClose} className="close-button">Close</li>
        
        </div>
       
      </div>
    </div>
  );
}

export default Profile;