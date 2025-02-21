import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Snackbar, Alert } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import { firestore } from '../../Components/firebaseConfig';
import './AdminPredictionPage.css';

const AdminPredictionPage = () => {
  const [liveScore, setLiveScore] = useState({ team1: '', team2: '', score1: '', score2: '', time: '0:00' });
  const [upcomingMatches, setUpcomingMatches] = useState([{ team1: '', team2: '', date: '', time: '', odds: '' }]);
  const [recentMatches, setRecentMatches] = useState([{ team1: '', team2: '', date: '', score: '' }]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFirstHalf, setIsFirstHalf] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const liveScoreDoc = await firestore.collection('predictionData').doc('liveScore').get();
      if (liveScoreDoc.exists) setLiveScore(liveScoreDoc.data());

      const teamsSnapshot = await firestore.collection('teams').get();
      setAvailableTeams(teamsSnapshot.docs.map(doc => doc.data().name));

      const upcomingSnapshot = await firestore.collection('upcomingMatches').get();
      const recentSnapshot = await firestore.collection('recentMatches').get();

      setUpcomingMatches(
        upcomingSnapshot.docs.slice(0, 1).map(doc => doc.data()) || [{ team1: '', team2: '', date: '', time: '', odds: '' }]
      );
      setRecentMatches(
        recentSnapshot.docs.slice(0, 1).map(doc => doc.data()) || [{ team1: '', team2: '', date: '', score: '' }]
      );
    };

    const fetchMessageCount = async () => {
      const snapshot = await firestore.collection('messages').get();
      setMessageCount(snapshot.size);
    };

    fetchData();
    fetchMessageCount();
  }, []);

  const handleLiveScoreChange = (e) => {
    const { name, value } = e.target;
    setLiveScore(prev => ({ ...prev, [name]: value }));
  };

  const incrementTime = () => {
    setLiveScore(prev => {
      const [minutes, seconds] = prev.time.split(':').map(Number);
      const newSeconds = seconds === 59 ? 0 : seconds + 1;
      const newMinutes = newSeconds === 0 ? minutes + 1 : minutes;
      const maxTime = isFirstHalf ? 45 : 90;
      if (newMinutes === maxTime) {
        clearInterval(timerRef.current);
        setIsTimerRunning(false);
      }
      const updatedTime = `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`;
      
    
      firestore.collection('predictionData').doc('liveScore').update({ 
        time: updatedTime, 
        isFirstHalf: isFirstHalf 
      });
      
      return { ...prev, time: updatedTime };
    });
  };
  
  const startTimer = () => {
    if (liveScore.team1 && liveScore.team2 && liveScore.score1 && liveScore.score2) {
      if (!isTimerRunning) {
        timerRef.current = setInterval(incrementTime, 1000);
        setIsTimerRunning(true);
        
        firestore.collection('predictionData').doc('liveScore').update({
          isFirstHalf: isFirstHalf
        });
      }
    } else {
      setNotification({ open: true, message: "Please complete all live score fields", severity: "warning" });
    }
  };
  

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setLiveScore(prev => ({ ...prev, time: '0:00' }));
    setIsFirstHalf(true);
    firestore.collection('predictionData').doc('liveScore').update({
      time: '0:00',
      isFirstHalf: true
    });
  };
  

  const handleHalfSwitch = () => {
    const [minutes] = liveScore.time.split(':').map(Number);
  
    
    if (minutes < 45) {
      setNotification({ open: true, message: "Cannot start 2nd half before 45:00", severity: "warning" });
      return;
    }
  
    if (!isTimerRunning) {
      setIsFirstHalf(false);
      setLiveScore(prev => ({ ...prev, time: '45:00' }));
      firestore.collection('predictionData').doc('liveScore').update({
        time: '45:00',
        isFirstHalf: false
      });
    }
  };
  
  
  const handleMatchChange = (index, type, field, value) => {
    const update = type === 'upcoming' ? [...upcomingMatches] : [...recentMatches];
    update[index] = { ...update[index], [field]: value };
    type === 'upcoming' ? setUpcomingMatches(update) : setRecentMatches(update);
  };

  const addMatchSlot = (type) => {
    const update = type === 'upcoming' ? [...upcomingMatches] : [...recentMatches];
    if (update.length < 5) {
      const newMatch = type === 'upcoming'
        ? { team1: '', team2: '', date: '', time: '', odds: '' }
        : { team1: '', team2: '', date: '', score: '' };
      update.push(newMatch);
      type === 'upcoming' ? setUpcomingMatches(update) : setRecentMatches(update);
    }
  };

  const removeMatchSlot = (type) => {
    const update = type === 'upcoming' ? [...upcomingMatches] : [...recentMatches];
    if (update.length > 1) {
      update.pop();
      type === 'upcoming' ? setUpcomingMatches(update) : setRecentMatches(update);
    }
  };

  const isCompleteMatch = (match, type) => {
    const requiredFields = type === 'upcoming' ? ['team1', 'team2', 'date', 'time', 'odds'] : ['team1', 'team2', 'date', 'score'];
    return requiredFields.every(field => match[field]);
  };

  const saveData = async () => {
    const isMatchFilled = (match) => Object.values(match).some(field => field);  
    const isMatchComplete = (match, type) => {
        const requiredFields = type === 'upcoming' ? ['team1', 'team2', 'date', 'time', 'odds'] : ['team1', 'team2', 'date', 'score'];
        return requiredFields.every(field => match[field]);
    };

    const hasIncompleteUpcoming = upcomingMatches.some(match => isMatchFilled(match) && !isMatchComplete(match, 'upcoming'));
    const hasIncompleteRecent = recentMatches.some(match => isMatchFilled(match) && !isMatchComplete(match, 'recent'));
    const hasIncompleteLiveScore = Object.values(liveScore).some(value => value) && 
        !(liveScore.team1 && liveScore.team2 && liveScore.score1 && liveScore.score2 && liveScore.time);

    if (hasIncompleteUpcoming || hasIncompleteRecent || hasIncompleteLiveScore) {
        setNotification({ open: true, message: "Please complete all fields for each match", severity: "error" });
        return;
    }

    const clearCollection = async (collection) => {
        const snapshot = await collection.get();
        const batch = firestore.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    };

    const upcomingCollection = firestore.collection('upcomingMatches');
    const recentCollection = firestore.collection('recentMatches');
    const liveScoreCollection = firestore.collection('predictionData');

    await Promise.all([
        clearCollection(upcomingCollection),
        clearCollection(recentCollection),
        clearCollection(liveScoreCollection)
    ]);

    if (liveScore.team1 && liveScore.team2 && liveScore.score1 && liveScore.score2 && liveScore.time) {
        await firestore.collection('predictionData').doc('liveScore').set(liveScore);
    }

    const upcomingBatch = firestore.batch();
    upcomingMatches.forEach(match => {
        if (isMatchComplete(match, 'upcoming')) {
            const matchRef = upcomingCollection.doc();
            upcomingBatch.set(matchRef, match);
        }
    });
    await upcomingBatch.commit();

    const recentBatch = firestore.batch();
    recentMatches.forEach(match => {
        if (isMatchComplete(match, 'recent')) {
            const matchRef = recentCollection.doc();
            recentBatch.set(matchRef, match);
        }
    });
    await recentBatch.commit();

    setNotification({ open: true, message: "Data saved successfully!", severity: "success" });
  };

  const resetMatch = (index, type) => {
    const resetFields = type === 'upcoming'
      ? { team1: '', team2: '', date: '', time: '', odds: '' }
      : { team1: '', team2: '', date: '', score: '' };
    const update = type === 'upcoming' ? [...upcomingMatches] : [...recentMatches];
    update[index] = resetFields;
    type === 'upcoming' ? setUpcomingMatches(update) : setRecentMatches(update);
  };

  const resetLiveScore = () => {
    setLiveScore({ team1: '', team2: '', score1: '', score2: '', time: '' });
  };
 
  const getCurrentDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleTimeInputChange = (index, type, field, value) => {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (timePattern.test(value)) handleMatchChange(index, type, field, value);
  };

  return (
    <Box display="flex" className="admin-prediction-page">
      <Sidebar />
      <Box flexGrow={1} p="20px">
        <Header messageCount={messageCount} />
        <Box mb={4} className="admin-live-score-section">
          <Typography variant="h5" className="admin-section-title">Live Score</Typography>
          <TextField label="Team 1" name="team1" value={liveScore.team1} onChange={handleLiveScoreChange} fullWidth margin="normal" select className="admin-input">
            {availableTeams.map(team => (
              <MenuItem key={team} value={team}>{team}</MenuItem>
            ))}
          </TextField>
          <TextField label="Team 2" name="team2" value={liveScore.team2} onChange={handleLiveScoreChange} fullWidth margin="normal" select className="admin-input">
            {availableTeams.map(team => (
              <MenuItem key={team} value={team}>{team}</MenuItem>
            ))}
          </TextField>
          <TextField label="Score 1" name="score1" value={liveScore.score1} onChange={handleLiveScoreChange} type="number" fullWidth margin="normal" className="admin-input" />
          <TextField label="Score 2" name="score2" value={liveScore.score2} onChange={handleLiveScoreChange} type="number" fullWidth margin="normal" className="admin-input" />
          <TextField label="Time (HH:MM)" name="time" value={liveScore.time} onChange={(e) => handleLiveScoreChange(e)} fullWidth margin="normal" className="admin-input" placeholder="00:00 to 90:00"/>
                <Box display="flex" alignItems="center" gap="10px" mt={2}>
        <Typography variant="h6" className="timer-display">
          Time: {liveScore.time} {isFirstHalf ? "1st Half" : "2nd Half"}
        </Typography>
        <Button onClick={startTimer} disabled={isTimerRunning} variant="contained" color="primary">Start</Button>
        <Button onClick={pauseTimer} disabled={!isTimerRunning} variant="contained" color="secondary">Pause</Button>
        <Button onClick={resetTimer} variant="contained" color="error">Reset</Button>
        <Button onClick={handleHalfSwitch} variant="contained" color="warning">Next Half</Button>
      </Box>

          <Button onClick={resetLiveScore} variant="outlined" color="error" className="styled-button reset-button">Reset Live Score</Button>
        </Box>
        

<Box mb={4} className="admin-upcoming-matches-section">
          <Typography variant="h5" className="admin-section-title">Upcoming Matches</Typography>
          <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap="20px">
            {upcomingMatches.map((match, index) => (
              <Box key={index} className="admin-match-box">
                <TextField label="Team 1" value={match.team1} onChange={(e) => handleMatchChange(index, 'upcoming', 'team1', e.target.value)} fullWidth margin="normal" select className="admin-input">
                  {availableTeams.map(team => (
                    <MenuItem key={team} value={team}>{team}</MenuItem>
                  ))}
                </TextField>
                <TextField label="Team 2" value={match.team2} onChange={(e) => handleMatchChange(index, 'upcoming', 'team2', e.target.value)} fullWidth margin="normal" select className="admin-input">
                  {availableTeams.map(team => (
                    <MenuItem key={team} value={team}>{team}</MenuItem>
                  ))}
                </TextField>
                <TextField type="date" value={match.date} onChange={(e) => handleMatchChange(index, 'upcoming', 'date', e.target.value)} fullWidth margin="normal" className="admin-input" />
                <TextField label="Time (HH:MM)" value={match.time} onChange={(e) => handleMatchChange(index, 'upcoming', 'time', e.target.value)} fullWidth margin="normal" className="admin-input" placeholder="00:00 to 23:59" />
                <TextField label="Odds" value={match.odds} onChange={(e) => handleMatchChange(index, 'upcoming', 'odds', e.target.value)} fullWidth margin="normal" className="admin-input" />
                <Button onClick={() => resetMatch(index, 'upcoming')} variant="outlined" color="error" className="styled-button reset-button">Reset</Button>
              </Box>
            ))}
          </Box>
          <Button onClick={() => addMatchSlot('upcoming')} disabled={upcomingMatches.length >= 5} className="styled-button add-button">Add Upcoming Match</Button>
          <Button onClick={() => removeMatchSlot('upcoming')} disabled={upcomingMatches.length <= 1} className="styled-button remove-button">Remove Upcoming Match</Button>
        </Box>
  
     
        <Box mb={4} className="admin-recent-matches-section">
          <Typography variant="h5" className="admin-section-title">Recent Matches</Typography>
          <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap="20px">
            {recentMatches.map((match, index) => (
              <Box key={index} className="admin-match-box">
                <TextField label="Team 1" value={match.team1} onChange={(e) => handleMatchChange(index, 'recent', 'team1', e.target.value)} fullWidth margin="normal" select className="admin-input">
                  {availableTeams.map(team => (
                    <MenuItem key={team} value={team}>{team}</MenuItem>
                  ))}
                </TextField>
                <TextField label="Team 2" value={match.team2} onChange={(e) => handleMatchChange(index, 'recent', 'team2', e.target.value)} fullWidth margin="normal" select className="admin-input">
                  {availableTeams.map(team => (
                    <MenuItem key={team} value={team}>{team}</MenuItem>
                  ))}
                </TextField>
                <TextField type="date" value={match.date} onChange={(e) => handleMatchChange(index, 'recent', 'date', e.target.value)} fullWidth margin="normal" className="admin-input" />
                <TextField label="Score" value={match.score} onChange={(e) => handleMatchChange(index, 'recent', 'score', e.target.value)} fullWidth margin="normal" className="admin-input" />
                <Button onClick={() => resetMatch(index, 'recent')} variant="outlined" color="error" className="styled-button reset-button">Reset</Button>
             </Box>
            ))}
          </Box>
          <Button onClick={() => addMatchSlot('recent')} disabled={recentMatches.length >= 5} className="styled-button add-button">Add Recent Match</Button>
          <Button onClick={() => removeMatchSlot('recent')} disabled={recentMatches.length <= 1} className="styled-button remove-button">Remove Recent Match</Button>
        </Box>
  
        <Button variant="contained" color="secondary" onClick={saveData} className="admin-save-button">Save All</Button>
  
        <Snackbar open={notification.open} autoHideDuration={2000} onClose={() => setNotification({ ...notification, open: false })}>
          <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AdminPredictionPage;
