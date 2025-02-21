import React, { useContext, useState } from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsJustify } from 'react-icons/bs';
import './Admin.css';
import { IconButton, Badge, useTheme } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { ColorModeContext, tokens } from "../../Theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import Profile from './profile';

function Header({ OpenSidebar, messageCount, setMessageCount }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const goToMessages = () => {
    setMessageCount(0); 
    navigate('/messages');
  };

  const goToGmail = () => {
    window.location.href = 'https://mail.google.com/mail/u/1/#inbox';
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };



  return (
    <header className='header'>
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>
    
      <div className='header-right'>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <Badge badgeContent={messageCount} color="primary">
          <BsFillBellFill className='icon' onClick={goToMessages} />
        </Badge>
        <BsFillEnvelopeFill className='icon' onClick={goToGmail} />
        <BsPersonCircle className='icon' onClick={toggleSidebar} />
      </div>
      <Profile isOpen={isSidebarOpen} onClose={toggleSidebar} /> 
    </header>
  );
}

export default Header;