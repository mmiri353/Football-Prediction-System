import React from "react";
import { FaBook, FaGlobe } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import './AboutUs.css';

const About = () => {
    return (
          <body className="pred">
          
            <section className="about">
                <div className="about-1">
                    <h1>About Us</h1>
                    <p>Welcome to AI Soccer Pro!</p>
                    <p>At AI Soccer Pro, we are passionate about football and committed to harnessing the power of technology to enhance the experience for fans around the world. Our platform provides the most accurate and insightful football predictions using advanced machine learning algorithms. We deliver up-to-date information on leagues, matches, and players, empowering football enthusiasts to make informed decisions and deepen their love for the sport.</p>
                </div>
                <div className="about-2">
                    <div className="content-box-lg">
                        <div className="container">
                            <div className="about-items-container">
                                <div className="about-item">
                                    <FaBook className='icon' />
                                    <h3>Mission</h3>
                                    <hr></hr>
                                    <p>Our mission is to combine the passion of football with the power of technology. We aim to provide fans with the most accurate and insightful football predictions, enabling them to enjoy the sport in a whole new way.</p>
                                </div>
                                <div className="about-item">
                                    <FaGlobe className='icon'/>
                                    <h3>Vision</h3>
                                    <hr></hr>
                                    <p>Our vision is to revolutionize the way football fans engage with the game. We aspire to be the leading platform for football predictions and analysis, known for our accuracy, reliability, and innovation. By continuously improving our AI technology and expanding our coverage, we strive to create a global community where football fans can connect, share insights, and celebrate the beautiful game together.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
              
          </body>
    
    );
}

export default About;