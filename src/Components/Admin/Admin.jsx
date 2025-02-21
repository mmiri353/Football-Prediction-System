import React, { useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import './Admin.css';
import { firestore } from '../../Components/firebaseConfig'; 

const Admin = ({ messageCount, setMessageCount }) => {
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

  return (
    <div className="grid-container">
      <Header 
        OpenSidebar={handleSidebarToggle}
        messageCount={messageCount}
        setMessageCount={setMessageCount} 
      />
      <Sidebar openSidebarToggle={sidebarOpen} OpenSidebar={handleSidebarToggle} />
      <Home />
    </div>
  );
};

export default Admin;