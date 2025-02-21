import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import './Contact.css';
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import contact from '../../assets/contact.jpg';

const Contact = () => {
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    firestore.collection('messages').add({
      name: Name,
      email: email,
      message: message,
    })
    .then(() => {
      alert('Message has been submitted');
      setLoader(false);
    })
    .catch((error) => {
      alert(error.message);
      setLoader(false);
    });

    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <div className='contact'>
      <img src={contact} className='background fade-in' alt="" />
      <div className="content">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you! Whether you have questions, feedback, or need assistance, feel free to reach out to us through the form below or using the contact information provided.</p>
      </div>
      <div className="containercontact">
        <div className="contactInfo">
          <div className="box">
            <div className="icon"> <FaMapMarkerAlt /> </div>
            <div className="text">
              <h3>Address</h3>
              <p>4567 Main Road, Beirut, Lebanon</p>
            </div>
          </div>
          <div className="box">
            <div className="icon"> <FaPhone /></div>
            <div className="text">
              <h3>Phone</h3>
              <p>4567889</p>
            </div>
          </div>
          <div className="box">
            <div className="icon"><MdOutlineMail /></div>
            <div className="text">
              <h3>Email</h3>
              <p>usersaffairs@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="contactForm">
          <form onSubmit={handleSubmit}>
            <h2>Send Message</h2>
            <div className="inputBox">
              <input type="text" required value={Name} onChange={(e) => setName(e.target.value)} />
              <span>Full Name</span>
            </div>
            <div className="inputBox">
              <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <span>Your Email</span>
            </div>
            <div className="inputBox">
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
              <span>Type Your Message</span>
            </div>
            <div className="inputBox">
              <input type="submit" value="Send" style={{ background: loader ? "#ccc" : "rgb(2, 2, 110)" }} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;