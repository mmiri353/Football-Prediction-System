import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import MatchPredictionButton from './MatchPredictionButton';
import LiveScoreDisplay from './LiveScoreDisplay';
import CommentSection from './CommentSection';
import './PredictionPage.css';

const PredictionPage = () => {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);

  useEffect(() => {
  
    const unsubscribeUpcoming = firestore
      .collection('upcomingMatches')
      .onSnapshot((snapshot) => {
        const upcomingData = snapshot.docs
          .map((doc) => doc.data())
          .filter((match) => match.team1 && match.team2 && match.date && match.time && match.odds);
        setUpcomingMatches(upcomingData);
      });

  
    const unsubscribeRecent = firestore
      .collection('recentMatches')
      .onSnapshot((snapshot) => {
        const recentData = snapshot.docs
          .map((doc) => doc.data())
          .filter((match) => match.team1 && match.team2 && match.date && match.score);
        setRecentMatches(recentData);
      });

    // Cleanup listeners on component unmount
    return () => {
      unsubscribeUpcoming();
      unsubscribeRecent();
    };
  }, []);

  return (
    <div className="container">
      <header className="Header">
        <img src="src/assets/laligalogo1.png" alt="logolaliga" className="logoimg"/>
        <h1>LaLiga Football Predictions</h1>
      </header>

      <section className="match-info">
        <h2 className="upcoming-title">Upcoming Matches</h2>
        <div className="match-cards">
          {upcomingMatches.length > 0 ? (
            upcomingMatches.slice(0, 5).map((match, index) => (
              <div className="match-card" key={index}>
                <strong>{match.team1} vs {match.team2}</strong>
                <p>Date: {match.date} | Time: {match.time} EST</p>
                <p>Odds: {match.odds}</p>
                <MatchPredictionButton match={match} />
              </div>
            ))
          ) : (
            <div className="no-matches-card">
              <p>No upcoming matches</p>
            </div>
          )}
        </div>
      </section>



      <section className="live-section">
        <LiveScoreDisplay />
        <CommentSection />
      </section>

      <section className="recent-results">
        <h2 className="recent-title">Recent Match Results</h2>
        <div className="result-cards">
          {recentMatches.length > 0 ? (
            recentMatches.slice(0, 5).map((match, index) => (
              <div className="result-card" key={index}>
                <strong>{match.team1} {match.score} {match.team2}</strong>
                <p>Date: {match.date}</p>
              </div>
            ))
          ) : (
            <div className="no-matches-card">
              <p>No recent matches</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PredictionPage;