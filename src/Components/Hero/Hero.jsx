import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import arrow from '../../assets/arrow.jpg';
import play_icon from '../../assets/play_icon.png';
import pause_icon from '../../assets/pause_icon.png';

const Hero = ({ heroData, setHeroCount, heroCount, setPlayStatus, playStatus }) => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/LoginForm');
    };

    return (
        <div className='hero'>
            <div className="hero-text">
                <p>{heroData.text1}</p>
                <p>{heroData.text2}</p>
            </div>
            <div className="start" onClick={handleGetStarted}>
                <p>Get Started</p>
                <img src={arrow} alt="Get Started" />
            </div>
            <div className="hero-dot-play">
                <ul className="hero-dots">
                    <li onClick={() => setHeroCount(0)} className={heroCount === 0 ? "hero-dot blue" : "hero-dot"}></li>
                    <li onClick={() => setHeroCount(1)} className={heroCount === 1 ? "hero-dot blue" : "hero-dot"}></li>
                    <li onClick={() => setHeroCount(2)} className={heroCount === 2 ? "hero-dot blue" : "hero-dot"}></li>
                </ul>
                <div className="hero-play">
                    <img onClick={() => setPlayStatus(!playStatus)} src={playStatus ? pause_icon : play_icon} alt="Play/Pause" />
                    <p>See The Video</p>
                </div>
            </div>
        </div>
    );
};

export default Hero;