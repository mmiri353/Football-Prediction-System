import React, { useState, useEffect } from "react";
import { firestore } from "../firebaseConfig";


const LiveScoreDisplay = () => {
  const [liveScore, setLiveScore] = useState(null);
  const [prediction, setPrediction] = useState("Waiting for prediction...");

  useEffect(() => {
    const unsubscribe = firestore
      .collection("predictionData")
      .doc("liveScore")
      .onSnapshot((doc) => {
        setLiveScore(doc.exists ? doc.data() : null);
      });
    return () => unsubscribe();
  }, []);

  const handlePredict = async () => {
    if (!liveScore || !liveScore.team1 || !liveScore.team2) {
      setPrediction("Error: Live match data is incomplete.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/predict-live", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          home_team: liveScore.team1.trim().toUpperCase(),
          away_team: liveScore.team2.trim().toUpperCase(),
          match_excitement: liveScore.matchExcitement || 5.0,
          home_rating: liveScore.team1Rating || 80,
          away_rating: liveScore.team2Rating || 75,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrediction(`Prediction: ${data.prediction === 0 ? "Home Win" : data.prediction === 1 ? "Draw" : "Away Win"}`);
      } else {
        const error = await response.json();
        setPrediction(`Error: ${error.error}`);
      }
    } catch (error) {
      setPrediction("Error: Unable to fetch prediction.");
    }
  };

  return (
    <div className="live-score">
      <h2 className="title-live">Live Score</h2>
      {liveScore ? (
        <div>
          <div className="score-container">
            <div className="team1">{liveScore.team1}</div>
            <div className="score">
              {liveScore.score1} - {liveScore.score2}
            </div>
            <div className="team2">{liveScore.team2}</div>
          </div>
          <div className="time-details">
            <p>
              Time: {liveScore.time}
              {liveScore.hasOwnProperty("isFirstHalf") && (
                <span className="half-indicator">
                  {liveScore.isFirstHalf ? " 1st Half" : " 2nd Half"}
                </span>
              )}
            </p>
          </div>
          <button onClick={handlePredict} className="predict-button">
            Predict Match
          </button>
          <div className="prediction-result">{prediction}</div>
        </div>
      ) : (
        <div className="no-matches-card">
          <p>No live matches available</p>
        </div>
      )}
    </div>
  );
};

export default LiveScoreDisplay;
