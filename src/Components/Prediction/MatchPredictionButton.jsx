import React, { useState } from 'react';

const MatchPredictionButton = ({ match }) => {
  const [predictionResult, setPredictionResult] = useState('');

  const handlePredict = async () => {
    try {
      // Send a request to the Flask backend
      const response = await fetch("http://127.0.0.1:5000/predict-upcoming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          home_team: match.team1,
          away_team: match.team2,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Display the prediction result based on the value
        if (data.prediction === 0) {
          setPredictionResult(`${match.team1} wins!`);
        } else if (data.prediction === 1) {
          setPredictionResult(`${match.team2} wins!`);
        } else {
          setPredictionResult("It's a draw!");
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Error fetching prediction: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={handlePredict} style={buttonStyle}>Predict Match</button>
      {predictionResult && <p style={resultStyle}>{predictionResult}</p>}
    </div>
  );
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  margin: '1rem 0',
};

const resultStyle = {
  color: 'green',
  fontWeight: 'bold',
  marginTop: '0.5rem',
};

export default MatchPredictionButton;
