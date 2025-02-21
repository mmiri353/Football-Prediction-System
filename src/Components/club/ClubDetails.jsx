import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore, Timestamp } from '../firebaseConfig';
import { denormalizeTeamName, normalizeTeamName } from '../../utils';
import { BsFillTrophyFill } from "react-icons/bs";
import insta from '../../assets/insta.png';
import { auth } from '../firebaseConfig';
import { FaThumbsUp } from "react-icons/fa"; // Import like icon
import './Club.css'; 

const ClubDetails = () => {
  const { name } = useParams(); // Retrieve team name from the URL
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login status
  const [newReply, setNewReply] = useState({});  // Store replies
  const [showStadiumDescription, setShowStadiumDescription] = useState(false);
  const [showClubHistory, setShowClubHistory] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch team and comment data
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const formattedName = denormalizeTeamName(name); // Format team name
        const snapshot = await firestore.collection('teams').where('name', '==', formattedName).get();
        
        if (!snapshot.empty) {
          const teamData = snapshot.docs[0].data();
          teamData.trophies = teamData.trophies.split(',').map(trophy => trophy.trim()); // Process trophy data
          teamData.trophyYears = teamData.trophyYears.split(',').map(year => year.trim()); // Process trophy years

          setTeam(teamData);

          const commentsSnapshot = await firestore.collection('teams').doc(snapshot.docs[0].id).collection('comments').get();
          const commentsData = commentsSnapshot.docs.map(commentDoc => ({
            id: commentDoc.id,
            ...commentDoc.data(),
            likes: Array.isArray(commentDoc.data().likes) ? commentDoc.data().likes : [], // Ensure likes is an array
          }));
          setComments(commentsData);
        } else {
          setTeam(null); // No team found
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
        setTeam(null); // Error fetching data
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    fetchTeamData();
  }, [name]);

  const handleSquadNavigation = () => {
    if (team) {
      navigate(`/club/${denormalizeTeamName(team.name)}/squad`);
    }
  };

  const handleStadiumClick = (e) => {
    e.preventDefault();
    setShowStadiumDescription(!showStadiumDescription);
  };

  const handleClubClick = (e) => {
    e.preventDefault();
    setShowClubHistory(!showClubHistory);
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission if this is a form handler
  
    const user = auth.currentUser;
  
    // Check if user is logged in, if not, display an alert and return
    if (!user) {
      alert("Please log in to submit a comment.");
      return;
    }
  
    // If the user is logged in but doesn't have a display name, set it as "Guest"
    const username = user.displayName || "Guest";
    
    const newCommentData = {
      text: newComment,
      createdAt: Timestamp.now(),
      email: user.email,
      username: username,
      likes: [],
    };
  
    try {
      const teamRef = firestore.collection('teams').doc(team.id);
      const commentRef = await teamRef.collection('comments').add(newCommentData);  // Use await here
  
      setComments([{ id: commentRef.id, ...newCommentData, replies: [] }, ...comments]);
      setNewComment(""); // Clear the input field after submitting
  
      alert("Comment submitted successfully!");
    } catch (error) {
      alert("Error submitting comment: " + error.message);  // Handle any errors
    }
  };
  
  
  

  // Handle like action on comment
  const handleLikeComment = async (commentId) => {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to like comments.');
      return;
    }
  
    const commentRef = firestore.collection('teams').doc(team.id).collection('comments').doc(commentId);
    const commentDoc = await commentRef.get();
    const commentData = commentDoc.data();
  
    // Ensure likes field exists and is an array (initialize to an empty array if not)
    const likes = Array.isArray(commentData.likes) ? commentData.likes : [];
  
    const updatedLikes = likes.includes(user.email)
      ? likes.filter(like => like !== user.email)
      : [...likes, user.email];
  
    await commentRef.update({
      likes: updatedLikes,
    });
  
    // Update the local comments state
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, likes: updatedLikes }
        : comment
    ));
  };

  // Handle reply submission
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    const user = auth.currentUser;
  const replyText = newReply[commentId];

  if (!user || !replyText) {
    alert('You must be logged in and provide a reply.');
    return;
  }
  
    const replyData = {
      text: replyText,
      createdAt: Timestamp.now(),
      email: user.email,
    };
  
    try {
      const replyRef = firestore.collection('teams').doc(team.id).collection('comments').doc(commentId).collection('replies');
      await replyRef.add(replyData);
  
      setComments(comments.map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...(comment.replies || []), replyData] }
          : comment
      ));
      setNewReply({ ...newReply, [commentId]: "" });
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };
  
  // Handle reply input change
  const handleReplyChange = (e, commentId) => {
    setNewReply({ ...newReply, [commentId]: e.target.value });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!team) {
    return <div className="no-data">No team data available.</div>;
  }
  const handleTeamClick = (team) => {
    navigate(`/club/${normalizeTeamName(team.name)}/${team.id}/stats`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!team) {
    return <div className="no-data">No team data available.</div>;
  }

  return (
    <div className="page">
      <div className="club-details-container">
        <div className="header">
          <img src={team.imageUrl} alt={team.name} className="team-image" />
          <h1 className="team-name">{team.name}</h1>
        </div>
        <div className="details-container">
          <div className="details-column">
            <p><strong>Foundation Year:</strong> {team.yearoffoundation}</p>
            <p><strong>President:</strong> {team.president}</p>
            <p><strong>Stadium:</strong> {team.stadium}</p>
          </div>
          <div className="details-column">
            <p><strong>Official Website:</strong> <a href={team.officialWeb} target="_blank" rel="noopener noreferrer">{team.officialWeb}</a></p>
            <div>
              <a href={team.instagram}>
                <p><img src={insta} alt="" />Instagram</p> 
              </a>
              <p><strong>Trophies:</strong></p>
              <ul>
                {team.trophies.length > 0 ? (
                  team.trophies.map((trophy, index) => (
                    <li key={index}>{trophy} <BsFillTrophyFill /></li>
                  ))
                ) : (
                  <li>No trophies data available</li>
                )}
              </ul>
            </div>
            <div>
              <p><strong>Trophy Years:</strong></p>
              <select>
                {team.trophyYears.length > 0 ? (
                  team.trophyYears.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))
                ) : (
                  <option>No trophy years data available</option>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="table-header">
        <ul>
          <li >Club</li>
          <li onClick={handleSquadNavigation}>Squad</li>
          <li>Next Matches</li>
          <li>Results</li>
          <li onClick={() => handleTeamClick(team)}>Statistics</li>
        </ul>
      </div>
      <div className="divider-line"></div>
      <div className='info1'>
        <p className='info'>WHERE DO {team.name} PLAY? </p>
        <p > {team.name} play their LALIGA EA SPORTS matches at the <a className="stadium" href="#" onClick={handleStadiumClick}>{team.stadium}</a>.</p>
        {showStadiumDescription && (
          <div className="stadium-description">
            <p>{team.stadiumdescription}</p>
          </div>
        )}
      </div>
      <div className="divider-line"></div>
       <div className='info1'>
        <p className='info'>Know more about <a className="stadium" href="#" onClick={handleClubClick}>{team.name}</a></p>
        {showClubHistory && (
          <div className="stadium-description">
            <p>{team.history}</p>
          </div>
        )}
      </div>
      <div className="divider-line2"></div>
      <div className="divider-line"></div>
      <div className="comments-section">
  {/* Left Column: Comment Form */}
  <div className="comment-form-container">
  {isLoggedIn ? (
  <form className="comment-form" onSubmit={handleCommentSubmit}>
    <h3>Your Comment</h3>
    <textarea
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      placeholder="Write a comment..."
    />
    <button type="submit">Submit</button>
  </form>
) : (
  <p className="login-warning">You must be logged in to leave a comment.</p>
)}

  </div>

  {/* Right Column: Comments List */}
  <div className="comment-list-container">
    <h3>Comments</h3>
    {comments.length > 0 ? (
      comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="comment-header">
            <span>{comment.email}</span>
            
              
            
          </div>
          <p>{comment.text}</p>
          <FaThumbsUp
  className={`like-icon ${comment.likes.includes(auth.currentUser?.email) ? 'liked' : ''}`}
  onClick={() => handleLikeComment(comment.id)}
/>

{comment.likes.length}

          <div className="comment-replies">
            {comment.replies &&
              comment.replies.map((reply, index) => (
                <div key={index} className="comment-reply">
                  <span>{reply.email}</span>
                  <p>{reply.text}</p>
                </div>
              ))}
            {isLoggedIn && (
  <div className="reply-form">
    <textarea
      value={newReply[comment.id] || ''}
      onChange={(e) => handleReplyChange(e, comment.id)}
      placeholder="Write a reply..."
    />
    <button onClick={(e) => handleReplySubmit(e, comment.id)}>Reply</button>
  </div>
)}
            
          </div>
        </div>
      ))
    ) : (
      <p>No comments yet. Be the first to comment!</p>
    )}
  </div>
</div>

</div> 
  )};
export default ClubDetails;
