import React from 'react';
import { PiSoccerBallFill } from "react-icons/pi";
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const location = useLocation();

    const getUserName = (email) => {
        if (email) {
            return email.split('@')[0];
        }
        return '';
    };

    return (
        <div className='nav'>
            <div className="nav-logo">
                <p className="ai-text">AI </p>
                <p>S<PiSoccerBallFill className="logoicon"/>CCER</p>
            </div>
            <ul className="nav-menu">
                <li>
                    <Link 
                        to="/" 
                        className={location.pathname === '/' ? 'active' : ''}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/news" 
                        className={location.pathname === '/news' ? 'active' : ''}
                    >
                        News
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/club" 
                        className={location.pathname === '/club' ? 'active' : ''}
                    >
                        Clubs
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/About-AI-Soccer-Pro" 
                        className={location.pathname === '/About-AI-Soccer-Pro' ? 'active' : ''}
                    >
                        About
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/Contact" 
                        className={location.pathname === '/Contact' ? 'active' : ''}
                    >
                        Contact
                    </Link>
                </li>
                
                {/* Show Prediction link only if logged in */}
                {isLoggedIn && (
                    <li>
                        <Link 
                            to="/prediction" 
                            className={location.pathname === '/prediction' ? 'active' : ''}
                        >
                            Prediction
                        </Link>
                    </li>
                )}

                {/* LogIn / User Greeting and Logout */}
                {!isLoggedIn ? (
                    <li>
                        <Link 
                            to="/LoginForm" 
                            className={location.pathname === '/LoginForm' ? 'active' : ''}
                        >
                            LogIn
                        </Link>
                    </li>
                ) : (
                    <>
                        <li className="user-name" style={{ color: 'white' }}>Welcome, {getUserName(user?.email)}!</li>
                        <li>
                            <Link 
                                to="/" 
                                onClick={logout}
                                className={location.pathname === '/' ? 'active' : ''}
                            >
                                Logout
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default Navbar;