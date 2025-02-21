import React, { useState, useRef, useEffect } from 'react';

const CommentSection = () => {
 
  const [comments, setComments] = useState([
    "Great goal by Team A!",
    "Team B is dominating the game.",
    "Exciting match so far!",
    "Can't believe that call!",
    "Looking forward to the next game.",
  ]);


  const [newComment, setNewComment] = useState('');

 
  const commentListRef = useRef(null);

 
  const handleInputChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newComment.trim() !== '') {
      setComments((prevComments) => {
        const updatedComments = [...prevComments, newComment];
     
        return updatedComments.slice(-100);
      });
      setNewComment('');
    }
  };

  
  useEffect(() => {
    if (commentListRef.current) {
      commentListRef.current.scrollTop = commentListRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div className="comment-section">
      <h2 className="comment-title">Live Comments</h2>
      <ul className="comment-list" ref={commentListRef}>
        {comments.map((comment, index) => (
          <li key={index} className="comment-item">{comment}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="comment-input"
          placeholder="Add a comment..."
          value={newComment}
          onChange={handleInputChange}
        />
        <button className="comment-button" type="submit">Send</button>
      </form>
    </div>
  );
};

export default CommentSection;
