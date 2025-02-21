import { firestore } from "./firebaseConfig";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  FieldValue 
} from "firebase/firestore";

// ** TEAM FUNCTIONS **

// Add a team
export const addTeam = async (team) => {
  const teamsCollection = collection(firestore, "teams");
  const teamDoc = await addDoc(teamsCollection, team);
  return teamDoc.id;
};

// Update a team
export const updateTeam = async (teamId, updatedTeamData) => {
  const teamDocRef = doc(firestore, "teams", teamId);
  await updateDoc(teamDocRef, updatedTeamData);
};

// Delete a team
export const deleteTeam = async (teamId) => {
  const teamDocRef = doc(firestore, "teams", teamId);
  await deleteDoc(teamDocRef);
};

// Fetch all teams with players, comments, and likes count
export const fetchTeams = async () => {
  const teamsCollection = collection(firestore, "teams");
  const teamsSnapshot = await getDocs(teamsCollection);
  const teams = [];

  for (const teamDoc of teamsSnapshot.docs) {
    const teamData = teamDoc.data();
    const teamId = teamDoc.id;

    // Fetch players
    const playersSnapshot = await getDocs(collection(firestore, "teams", teamId, "players"));
    const players = playersSnapshot.docs.map(playerDoc => ({
      id: playerDoc.id,
      ...playerDoc.data(),
      comments: [], // Initialize comments for each player
    }));

    // Fetch team comments and their likes/replies count
    const teamCommentsSnapshot = await getDocs(collection(firestore, "teams", teamId, "comments"));
    const teamComments = await Promise.all(teamCommentsSnapshot.docs.map(async (commentDoc) => {
      const commentData = commentDoc.data();
      const commentId = commentDoc.id;

      // Fetch replies for the team comment
      const repliesSnapshot = await getDocs(collection(firestore, "teams", teamId, "comments", commentId, "replies"));
      const replies = repliesSnapshot.docs.map(replyDoc => replyDoc.data());

      // Fetch likes count for the comment
      const likesSnapshot = await getDocs(collection(firestore, "teams", teamId, "comments", commentId, "likes"));
      const likesCount = likesSnapshot.size;

      return {
        id: commentId,
        ...commentData,
        likesCount,
        repliesCount: replies.length,
        replies,
      };
    }));

    // Fetch player comments and their likes/replies count
    for (const player of players) {
      const playerCommentsSnapshot = await getDocs(collection(firestore, "teams", teamId, "players", player.id, "playercomments"));
      const playerComments = await Promise.all(playerCommentsSnapshot.docs.map(async (commentDoc) => {
        const commentData = commentDoc.data();
        const commentId = commentDoc.id;

        // Fetch replies for the player comment
        const repliesSnapshot = await getDocs(collection(firestore, "teams", teamId, "players", player.id, "playercomments", commentId, "replies"));
        const replies = repliesSnapshot.docs.map(replyDoc => replyDoc.data());

        // Fetch likes count for the player comment
        const likesSnapshot = await getDocs(collection(firestore, "teams", teamId, "players", player.id, "playercomments", commentId, "likes"));
        const likesCount = likesSnapshot.size;

        return {
          id: commentId,
          ...commentData,
          likesCount,
          repliesCount: replies.length,
          replies,
        };
      }));

      player.comments = playerComments;
    }

    teams.push({
      id: teamId,
      ...teamData,
      players,
      comments: teamComments,
    });
  }

  return teams;
};

// Add comment to a team
export const addTeamComment = async (teamId, comment) => {
  const commentsCollection = collection(firestore, "teams", teamId, "comments");
  const commentDoc = await addDoc(commentsCollection, { ...comment, likes: [], replies: [] });
  return commentDoc.id;
};

// Like a team comment
export const likeTeamComment = async (teamId, commentId, userId) => {
  const commentDocRef = doc(firestore, "teams", teamId, "comments", commentId);
  await updateDoc(commentDocRef, {
    likes: FieldValue.arrayUnion(userId),
  });
};

// Unlike a team comment
export const unlikeTeamComment = async (teamId, commentId, userId) => {
  const commentDocRef = doc(firestore, "teams", teamId, "comments", commentId);
  await updateDoc(commentDocRef, {
    likes: FieldValue.arrayRemove(userId),
  });
};

// Add reply to a team comment
export const addTeamCommentReply = async (teamId, commentId, reply) => {
  const repliesCollection = collection(firestore, "teams", teamId, "comments", commentId, "replies");
  const replyDoc = await addDoc(repliesCollection, { ...reply, createdAt: new Date() });
  return replyDoc.id;
};

// Fetch replies for a team comment
export const fetchTeamCommentReplies = async (teamId, commentId) => {
  const repliesCollection = collection(firestore, "teams", teamId, "comments", commentId, "replies");
  const repliesSnapshot = await getDocs(repliesCollection);
  return repliesSnapshot.docs.map(replyDoc => ({
    id: replyDoc.id,
    ...replyDoc.data(),
  }));
};

// ** PLAYER FUNCTIONS **

// Add a player to a team
export const addPlayer = async (teamId, player) => {
  const playersCollection = collection(firestore, "teams", teamId, "players");
  const playerDoc = await addDoc(playersCollection, player);
  return playerDoc.id;
};

// Update a player
export const updatePlayer = async (teamId, playerId, player) => {
  const playerDocRef = doc(firestore, "teams", teamId, "players", playerId);
  await updateDoc(playerDocRef, player);
};

// Delete a player
export const deletePlayer = async (teamId, playerId) => {
  const playerDocRef = doc(firestore, "teams", teamId, "players", playerId);
  await deleteDoc(playerDocRef);
};

// Add comment to a player
// Add comment to a player
export const addPlayerComment = async (teamId, playerId, comment) => {
  const playerCommentsCollection = collection(firestore, "teams", teamId, "players", playerId, "playercomments");
  const commentDoc = await addDoc(playerCommentsCollection, { 
    ...comment, 
    likes: [],    // Initialize the likes array
    replies: []   // Initialize the replies array
  });
  return commentDoc.id;
};


// Like a player comment
export const likePlayerComment = async (teamId, playerId, commentId, userId) => {
  const commentDocRef = doc(firestore, "teams", teamId, "players", playerId, "playercomments", commentId);
  await updateDoc(commentDocRef, {
    likes: FieldValue.arrayUnion(userId),
  });
};

// Unlike a player comment
export const unlikePlayerComment = async (teamId, playerId, commentId, userId) => {
  const commentDocRef = doc(firestore, "teams", teamId, "players", playerId, "playercomments", commentId);
  await updateDoc(commentDocRef, {
    likes: FieldValue.arrayRemove(userId),
  });
};

// Add reply to a player comment
// Add reply to a player comment
export const addPlayerCommentReply = async (teamId, playerId, commentId, reply) => {
  const repliesCollection = collection(firestore, "teams", teamId, "players", playerId, "playercomments", commentId, "replies");
  const replyDoc = await addDoc(repliesCollection, { 
    ...reply, 
    createdAt: new Date() 
  });
  return replyDoc.id;
};


// Fetch replies for a player comment
export const fetchPlayerCommentReplies = async (teamId, playerId, commentId) => {
  const repliesCollection = collection(firestore, "teams", teamId, "players", playerId, "playercomments", commentId, "replies");
  const repliesSnapshot = await getDocs(repliesCollection);
  return repliesSnapshot.docs.map(replyDoc => ({
    id: replyDoc.id,
    ...replyDoc.data(),
  }));
};
