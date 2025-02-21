import React, { useState, useEffect } from "react";
import { Box } from '@mui/material';
import './setting.css';
import Sidebar from '../Sidebar';
import Header from "../Header"; 
import { firestore } from '../../../Components/firebaseConfig';

const Setting = () => {
    const [messageCount, setMessageCount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchMessageCount = async () => {
            const snapshot = await firestore.collection('messages').get();
            setMessageCount(snapshot.size);
        };
    
        fetchMessageCount();
    }, [setMessageCount]);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSelectChange = (filePath) => {
        window.open(filePath);
    };

    const handleButtonClick = (file) => {
        const filePath = `vscode://file/C:/Users/user/Desktop/fyp/fyp/src/Components/${file}`;
        window.open(filePath);
    };

    return (
        <Box display="flex" flexDirection="row">
            <Box height="100%" width="250px">
                <Sidebar />
            </Box>
            <Box m="20px" flexGrow={1}>
                <Header OpenSidebar={handleSidebarToggle} messageCount={messageCount} setMessageCount={setMessageCount} />
                <div className='page'>
                    <table className="settings-table">
                        <thead>
                            <tr>
                                <th>Page</th>
                                <th>Content</th>
                                <th>Style</th>
                            </tr>
                        </thead>
                        <tbody>
                           
                            <tr>
                                <td>Home Page</td>
                                <td>
                                   
                                    <button onClick={() => handleButtonClick('Navbar/Navbar.jsx')}>Navbar Content</button>
                                </td>
                                <td>
                                  
                                    <button onClick={() => handleButtonClick('Navbar/Navbar.css')}>Navbar Style</button>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                   
                                    <button onClick={() => handleButtonClick('Background/Background.jsx')}>Background Content</button>
                                </td>
                                <td>
                                   
                                    <button onClick={() => handleButtonClick('Background/Background.css')}>Background Style</button>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    
                                    <button onClick={() => handleButtonClick('Hero/Hero.jsx')}>Hero Content</button>
                                </td>
                                <td>
                                   
                                    <button onClick={() => handleButtonClick('Hero/Hero.css')}>Hero Style</button>
                                </td>
                            </tr>
                           
                            <tr>
                                <td>About Page</td>
                                <td>
                                    <button onClick={() => handleButtonClick('About/About.jsx')}>About Page Content</button>
                                </td>
                                <td>
                                    <button onClick={() => handleButtonClick('About/About.css')}>About Page Style</button>
                                </td>
                            </tr>
                           
                            <tr>
                                <td>LogIn Page</td>
                                <td>
                                    <button onClick={() => handleButtonClick('LoginForm/LoginForm.jsx')}>LogIn Page Content</button>
                                </td>
                                <td>
                                    <button onClick={() => handleButtonClick('LoginForm/LoginForm.css')}>LogIn Page Style</button>
                                </td>
                            </tr>
                           
                            <tr>
                                <td>Privacy Policy</td>
                                <td>
                                    <button onClick={() => handleButtonClick('PrivacyPolicy/PrivacyPolicy.jsx')}>Privacy Policy Content</button>
                                </td>
                                <td>
                                    <button onClick={() => handleButtonClick('PrivacyPolicy/PrivacyPolicy.css')}>Privacy Policy Style</button>
                                </td>
                            </tr>
                           
                            <tr>
                                <td>Terms & Conditions</td>
                                <td>
                                    <button onClick={() => handleButtonClick('Terms/Term.jsx')}>Terms & Conditions Content</button>
                                </td>
                                <td>
                                    <button onClick={() => handleButtonClick('Terms/Term.css')}>Terms & Conditions Style</button>
                                </td>
                            </tr>
                            
                            <tr>
                                <td>Contact Page</td>
                                <td>
                                    <button onClick={() => handleButtonClick('Contact/Contact.jsx')}>Contact Page Content</button>
                                </td>
                                <td>
                                    <button onClick={() => handleButtonClick('Contact/Contact.css')}>Contact Page Style</button>
                                </td>
                            </tr>
                           
                            <tr>
                                <td>Footer</td>
                                <td>
                                    <button onClick={() => handleButtonClick('Footer/Footer.jsx')}>Footer Page Content</button>
                                </td>
                                <td>
                                    <button onClick={() => handleButtonClick('Footer/Footer.css')}>Footer Page Style</button>
                                </td>
                            </tr>
                            
                            <tr>
                                <td>Admin</td>
                                <td>
                                    <button onClick={() => handleButtonClick('Admin/Admin.jsx')}>Admin Page Content</button>
                                </td>
                                <td>
                                    <button onClick={() => handleButtonClick('Admin/Admin.css')}>Admin Page Style</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Club</td>
                                <td>
                                    <button onClick={() => handleButtonClick('club/Club.jsx')}>Club Page Content</button>
                                </td>
                                <td>
                                    <button onClick={() => handleButtonClick('club/Club.css')}>Club Page Style</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Club Details</td>
                                <td>
                                    <button onClick={() => handleButtonClick('/club/ClubDetails.jsx')}>Club Details Page Content</button>
                                </td>
                                <td>
                                    <button onClick={() => handleButtonClick('club/Club.css')}>Club Details Page Style</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Club Stats</td>
                                <td>
                                    <button onClick={() => handleButtonClick('/club/ClubStats.jsx')}>Club Statistics Page Content</button>
                                </td>
                                <td>
                                    <button onClick={() => handleButtonClick('club/ClubStats.css')}>Club Statistics Page Style</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Club Squad</td>
                                <td>
                                    <button onClick={() => handleButtonClick('/club/Squad.jsx')}>Club Squad Page Content</button>
                                </td>
                                <td>
                                    <button onClick={() => handleButtonClick('club/Squad.css')}>Club Squad Page Style</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Players Details</td>
                                <td>
                                    <button onClick={() => handleButtonClick('/club/PlayerDetails.jsx')}>Players Details Page Content</button>
                                </td>
                                <td>
                                    <button onClick={() => handleButtonClick('club/PlayerDetails.css')}>Players Details Page Style</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Box>
        </Box>
    );
}

export default Setting;
