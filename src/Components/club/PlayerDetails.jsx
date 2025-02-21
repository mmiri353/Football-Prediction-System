import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore, auth } from '../firebaseConfig';
import './PlayerDetails.css';
import { TbHexagonLetterA } from "react-icons/tb";
import { PiSoccerBallFill } from "react-icons/pi";
import { TfiCup } from "react-icons/tfi";
import { GiWhistle } from "react-icons/gi";
import { VscArrowSwap } from "react-icons/vsc";
import { CiClock2 } from "react-icons/ci";
import images from '../../assets/images.png';
import soccernet from '../../assets/soccernet.jpg';
import redcard from '../../assets/redcard.png';
import yellowcard from '../../assets/yellowcard.png';
import penalty from '../../assets/penalty.png';
import { FaThumbsUp } from "react-icons/fa";
import { MdPersonAdd } from "react-icons/md";

const PlayerDetails = () => {
  const { playerName } = useParams();
  const [team, setTeam] = useState(null);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentIdForReply, setCommentIdForReply] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [newReply, setNewReply] = useState({});
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const fetchPlayerAndTeam = async () => {
      try {
        const playerSnapshot = await firestore.collectionGroup('players').where('name', '==', playerName).get();
        if (!playerSnapshot.empty) {
          const playerData = playerSnapshot.docs[0].data();
          setPlayer(playerData);

          const teamRef = playerSnapshot.docs[0].ref.parent.parent;
          const teamSnapshot = await teamRef.get();
          if (teamSnapshot.exists) {
            const teamData = teamSnapshot.data();
            teamData.trophies = teamData.trophies.split(',').map(trophy => trophy.trim());
            teamData.trophyYears = teamData.trophyYears.split(',').map(year => year.trim());
            setTeam(teamData);
          } else {
            setError('No team data found for this player.');
          }

          const commentsSnapshot = await firestore.collection('teams').doc(teamRef.id).collection('players').doc(playerSnapshot.docs[0].id).collection('playercomments').get();
          const commentsData = commentsSnapshot.docs.map(doc => doc.data());
          setComments(commentsData);
        } else {
          setError('No player data found.');
        }
      } catch (error) {
        console.error('Error fetching player and team data:', error);
        setError('An error occurred while fetching player and team data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerAndTeam();
  }, [playerName]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to add a comment.');
      return;
    }
  
    const commentData = {
      email: user.email,
      comment: newComment,
      date: new Date().toLocaleString(),
      likes: [], // Ensure likes is an empty array
      replies: [], // Ensure replies is an empty array
    };
  
    try {
      await firestore
        .collection('teams')
        .doc(team.id)
        .collection('players')
        .doc(player.id)
        .collection('playercomments')
        .add(commentData);
  
      setComments([...comments, { ...commentData }]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  const handleLikeComment = async (commentId) => {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to like comments.');
      return;
    }
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const updatedLikes = comment.likes + 1;
        return { ...comment, likes: updatedLikes };
      }
      return comment;
    });

    setComments(updatedComments);

    const commentRef = firestore.collection('teams').doc(team.id).collection('players').doc(player.id).collection('playercomments').doc(commentId);
    await commentRef.update({ likes: firestore.FieldValue.increment(1) });
  };

  const handleReplyChange = (e, commentId) => {
    setNewReply((prevReplies) => ({
      ...prevReplies,
      [commentId]: e.target.value,
    }));
  };
  
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    const user = auth.currentUser;
    const replyText = newReply[commentId];
  
    if (!user || !replyText) {
      alert('You must be logged in and provide a reply.');
      return;
    }
  
    const replyData = {
      email: user.email,
      reply: newReply[commentId],  // Use the reply for the specific comment
      date: new Date().toLocaleString(),
    };
  
    try {
      const commentRef = firestore.collection('teams').doc(team.id).collection('players').doc(player.id).collection('playercomments').doc(commentId);
      await commentRef.update({
        replies: firestore.FieldValue.arrayUnion(replyData),
      });
  
      // Update the state to reflect the reply
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, replies: [...comment.replies, replyData] };
        }
        return comment;
      }));
      setNewReply((prevReplies) => ({
        ...prevReplies,
        [commentId]: '',  // Reset the reply input for this comment
      }));
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };
  

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!player || !team) {
    return <div className="no-data">No player or team data available.</div>;
  }

  const isGoalkeeper = player.role.toLowerCase() === 'goalkeeper';

  return (
    <div className="player-details-page-custom">
      <div className="player-info-container-custom">
        <div className="player-header-custom">
          <div>
            <img src={player.imageUrl} alt={player.name} className="player-image-custom" />
            <p className='role'>{player.role}</p>
          </div>
          <div className="player-info-main-custom">
            <div className="player-number-custom">{player.number}</div>
            <div className="player-name-country-custom">
              <div className="player-name-custom">{player.name}</div>
              <div className="player-country-custom">{player.placeOfBirth}</div>
            </div>
          </div>
        </div>
        <div className="player-info-custom">
          <table className="player-info-table-custom">
            <thead>
              <tr>
                <th>Date of Birth</th>
                <th>Height</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{player.dateOfBirth}</td>
                <td>{player.height}</td>
                <td>{player.weight}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Statistics</h2>
        <div className="statistics-container-custom">
          <table className="player-stats-custom">
            <tbody>
              {!isGoalkeeper && (
                <>
                  <tr><td> <PiSoccerBallFill className='icons'/> Goals</td><td>{player.goals}</td></tr>
                  <tr><td> <TbHexagonLetterA className='icons'/> Assists</td><td>{player.assists}</td></tr>
                  <tr><td> <TfiCup className='icons'/> Shots</td><td>{player.shots}</td></tr>
                </>
              )}
              <tr><td> <PiSoccerBallFill className='icons'/> Matches Played</td><td>{player.matchesPlayed}</td></tr>
              <tr><td> <CiClock2 className='icons' /> Minutes</td><td>{player.minutes}</td></tr>
              <tr><td><MdPersonAdd className='icons'/> Starts</td><td>{player.starts}</td></tr>
              {isGoalkeeper && (
                <>
                  <tr><td><img src={soccernet} className='image' alt="" />  Keep Catches</td><td>{player.keepCatches}</td></tr>
                  <tr><td><img src={soccernet} className='image' alt="" /> Keep Blocks</td><td>{player.keepBlocks}</td></tr>
                  <tr><td><img src={penalty} className='image' alt="" /> Penalties Blocked</td><td>{player.penaltiesBlocked}</td></tr>
                </>
              )}
            </tbody>
          </table>
          <table className="player-stats-custom">
            <tbody>
              <tr><td> <VscArrowSwap className='icons'/> Substitutions</td><td>{player.substitutions}</td></tr>
              {!isGoalkeeper && (
                <>
                  <tr><td><GiWhistle className='icons'/> Fouls</td><td>{player.fouls}</td></tr>
                  <tr><td><img src={penalty} className='image' alt="" />Penalties</td><td>{player.penalties}</td></tr>
                </>
              )}
              {isGoalkeeper && (
                <>
                  <tr><td>  <GiWhistle className='icons'/>  Fouls Committed</td><td>{player.foulsCommitted}</td></tr>
                  <tr><td><img src={penalty} className='image' alt="" />  Penalties Received</td><td>{player.penaltiesReceived}</td></tr>
                </>
              )}
              <tr><td><img src={yellowcard} className='image' alt="" />Yellow Cards</td><td>{player.yellowCards}</td></tr>
              <tr><td><img src={redcard} className='image' alt="" />Red Cards</td><td>{player.redCards}</td></tr>
              <tr><td><img src={images} className='image' alt="" />Double Yellow Cards</td><td>{player.doubleYellowCards}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
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
            <p>You must be logged in to leave a comment.</p>
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
      <p>{comment.comment}</p>

      <FaThumbsUp
        className={`like-icon ${comment.likes && comment.likes.includes(auth.currentUser?.email) ? 'liked' : ''}`}
        onClick={() => handleLikeComment(comment.id)}
      />

      <div>{comment.likes ? comment.likes.length : 0} Likes</div>

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
                <button onClick={(e) => handleReplySubmit(e, comment.id)}>
                  Reply
                </button>
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

export default PlayerDetails;
