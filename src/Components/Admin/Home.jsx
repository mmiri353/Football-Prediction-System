import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFillGearFill } from 'react-icons/bs';
import { SiLeagueoflegends } from 'react-icons/si';
import { HiMiniUsers } from 'react-icons/hi2';
import { BsChatLeftDotsFill } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPeopleGroup } from 'react-icons/fa6';
import { TbSoccerField } from "react-icons/tb";
import { GiBabyfootPlayers } from 'react-icons/gi';
import { PiNotePencilBold } from 'react-icons/pi';  // Import icon for Prediction Page if you have a specific icon in mind

import './Admin.css';

function Home() {
    const navigate = useNavigate();

    const handleNavigation = (url) => {
        navigate(url);
    };

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
            </div>

            <div className='main-cards'>
                <div className='card' onClick={() => handleNavigation('/users')}>
                    <div className='card-inner'>
                        <h3>Users</h3>
                        <HiMiniUsers className='card_icon' />
                    </div>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>Leagues</h3>
                        <SiLeagueoflegends className='card_icon' />
                    </div>
                </div>
                <div className='card' onClick={() => handleNavigation('/admin/clubs')}>
                    <div className='card-inner'>
                        <h3>Teams</h3>
                        <GiBabyfootPlayers className='icon' /> 
                    </div>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>Matches</h3>
                        <TbSoccerField />
                    </div>
                </div>
                <div className='card' onClick={() => handleNavigation('/messages')}>
                    <div className='card-inner'>
                        <h3>Feedback</h3>
                        <BsChatLeftDotsFill />
                    </div>
                </div>
                <div className='card' onClick={() => handleNavigation('/teams')}>
                    <div className='card-inner'>
                        <h3>Web Team</h3>
                        <FaPeopleGroup className='card_icon' />
                    </div>
                </div>
                <div className='card' onClick={() => handleNavigation('/calendar')}>
                    <div className='card-inner'>
                        <h3>Calendar</h3>
                        <FaCalendarAlt className='card_icon' />
                    </div>
                </div>
                <div className='card' onClick={() => handleNavigation('/Setting')}>
                    <div className='card-inner'>
                        <h3>Setting</h3>
                        <BsFillGearFill className='card_icon' />
                    </div>
                </div>
                {/* Prediction Page Button */}
                <div className='card' onClick={() => handleNavigation('/admin/predictionpage')}>
                    <div className='card-inner'>
                        <h3>Prediction Page</h3>
                        <PiNotePencilBold className='card_icon' />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Home;