import React from 'react';
import { Link } from 'react-router-dom';
import { BsGrid1X2Fill,   BsMenuButtonWideFill, BsFillGearFill } from 'react-icons/bs';
import { HiMiniUsers } from 'react-icons/hi2';
import { PiSoccerBallFill } from 'react-icons/pi';
import { SiLeagueoflegends } from 'react-icons/si';
import { TbPlayFootball } from 'react-icons/tb';
import { FaPeopleGroup } from 'react-icons/fa6';
import { GiBabyfootPlayers } from 'react-icons/gi';
import { MdFeedback } from 'react-icons/md';
import { FaCalendarAlt } from "react-icons/fa";
import { TbSoccerField } from "react-icons/tb";
import { PiNotePencilBold } from "react-icons/pi";
import './Admin.css';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <p className="ai-text">AI </p>
          <p>S<PiSoccerBallFill className="icon" />CCER</p>
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/admin">
            <BsGrid1X2Fill className='icon' /> Dashboard
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/users">
            <HiMiniUsers className='icon' /> Users
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/leagues">
            <SiLeagueoflegends className='icon' /> Leagues
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/admin/clubs">
            <GiBabyfootPlayers className='icon' /> Teams
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/matches">
          <TbSoccerField />Matches
          </Link>
        </li>
        
        
        <li className='sidebar-list-item'>
          <Link to="/messages">
            <MdFeedback className='icon' /> Feedback
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/note">
          <PiNotePencilBold className='icon' /> Notes
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/reports">
            <BsMenuButtonWideFill className='icon' /> Reports
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/teams">
            <FaPeopleGroup className='icon' /> Web Team
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/calendar">
          <FaCalendarAlt className='icon' /> Calendar
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/Setting">
            <BsFillGearFill className='icon' /> Setting
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/admin/predictionpage">
            <PiNotePencilBold className='icon' /> Prediction Page
          </Link>
        </li>
        
      </ul>
    </aside>
  )
}

export default Sidebar;