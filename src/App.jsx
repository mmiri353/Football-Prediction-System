// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './Theme';
import { AuthProvider } from './contexts/AuthContext';
import { firestore } from './Components/firebaseConfig';
import { Background } from './Components/Background/Background';
import Navbar from './Components/Navbar/Navbar';
import Hero from './Components/Hero/Hero';
import LoginForm from './Components/LoginForm/LoginForm';
import Contact from './Components/Contact/Contact';
import News from './Components/News/News';
import EuropaLeagueInfo from './Components/EuropaLeagueInfo/EuropaLeagueInfo';
import About from './Components/AboutUs/AboutUs';
import Forgetpassword from './Components/LoginForm/Forgetpassword';
import Admin from './Components/Admin/Admin';
import Messages from './Components/Admin/Messages';
import Calendar from './Components/Admin/calendar/calendar';
import { EventsProvider } from './Components/Admin/calendar/EventsContext';
import Setting from './Components/Admin/setting/setting';
import User from './Components/Admin/user';
import Team from './Components/Admin/team';
import Footer from './Components/footer/footer';
import PrivacyPolicy from './Components/PrivacyPolicy/PrivacyPolicy';
import TermsAndConditions from './Components/Terms/term';
import Note from './Components/Admin/Note';
import Club from './Components/club/Club';
import Clubs from './Components/Admin/Clubs';
import Players from './Components/Admin/Players';
import ClubDetails from './Components/club/ClubDetails';
import ClubStats from './Components/club/ClubStats';
import PredictionPage from './Components/Prediction/PredictionPage';
import { TeamProvider } from './TeamContext';
import Squad from './Components/club/Squad';
import PlayerDetails from './Components/club/PlayerDetails';
import AdminPredictionPage from './Components/Admin/AdminPredictionPage';


const App = () => {
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const fetchMessageCount = async () => {
      const snapshot = await firestore.collection('messages').get();
      setMessageCount(snapshot.size);
    };

    fetchMessageCount();
  }, []);

  const heroData = [
    { text1: 'Welcome to', text2: 'Football Predictor' },
    { text1: 'Keep up with the', text2: 'latest football news.' },
    { text1: 'Indulge Your', text2: 'Passions' },
  ];

  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((heroCount) => (heroCount === 2 ? 0 : heroCount + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthProvider>
      <TeamProvider>
        <Router>
          <EventsProvider>
            <AppContent
              heroData={heroData}
              heroCount={heroCount}
              setHeroCount={setHeroCount}
              playStatus={playStatus}
              setPlayStatus={setPlayStatus}
              messageCount={messageCount}
              setMessageCount={setMessageCount}
            />
          </EventsProvider>
        </Router>
      </TeamProvider>
    </AuthProvider>
  );
};

const AppContent = ({ heroData, heroCount, setHeroCount, playStatus, setPlayStatus, messageCount, setMessageCount }) => {
  const location = useLocation();
  const [theme, colorMode] = useMode();

  const adminPaths = [
    '/admin', 
    '/messages', 
    '/teams', 
    '/calendar', 
    '/users', 
    '/setting', 
    '/note', 
    '/admin/clubs',
    '/Setting', 
    '/admin/clubs/:teamId/players'
  ];

  const showNavbarAndFooter = !adminPaths.some(path => location.pathname.includes(path));

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>
          {location.pathname === '/' && <Background playStatus={playStatus} heroCount={heroCount} />}
          {showNavbarAndFooter && <Navbar />}

          <Routes>
            <Route path="/" element={
              <Hero
                setPlayStatus={setPlayStatus}
                heroData={heroData[heroCount]}
                heroCount={heroCount}
                setHeroCount={setHeroCount}
                playStatus={playStatus}
              />
            }/>
             <Route path="/prediction" element={<PredictionPage />} />
            <Route path="/about-ai-soccer-pro" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/news" element={<News />} />
            <Route path="/europeleagueinfo" element={<EuropaLeagueInfo />} />
            <Route path="/loginform" element={<LoginForm />} />
            <Route path="/reset" element={<Forgetpassword />} />
            <Route path="/admin" element={<Admin messageCount={messageCount} setMessageCount={setMessageCount} />} />
            <Route path="/messages" element={<Messages setMessageCount={setMessageCount} messageCount={messageCount} />} />
            <Route path="/teams" element={<Team />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/users" element={<User />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/termsandconditions" element={<TermsAndConditions />} />
            <Route path="/club" element={<Club />} />
            <Route path="/admin/clubs" element={<Clubs />} />
            <Route path="/admin/clubs/:teamId/players" element={<Players />} />
            <Route path="/club/:name" element={<ClubDetails />} />
            <Route path="/club/:name/squad" element={<Squad />} />
            <Route path="/player/:playerName" element={<PlayerDetails/>} />
            <Route path="/club/:name/:teamId/stats" element={<ClubStats />} />
            <Route path="/note" element={<Note messageCount={messageCount} setMessageCount={setMessageCount} />} />
            <Route path="/admin/predictionpage" element={<AdminPredictionPage />} />

          </Routes>
        </div>
        {showNavbarAndFooter && <Footer />}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;