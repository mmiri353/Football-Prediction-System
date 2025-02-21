import React, { useState, useEffect } from 'react';
import { firestore } from '../../Components/firebaseConfig';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Import deleteDoc
import './Admin.css';
import Sidebar from './Sidebar';
import Header from './Header';
import { Box } from '@mui/material'; 

const Note = ({ messageCount, setMessageCount }) => {
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

    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, "notes"));
                const notesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setNotes(notesData);
            } catch (error) {
                console.error("Error fetching notes: ", error);
            }
        };

        fetchNotes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(firestore, "notes"), {
                title: title,
                details: details
            });
            setTitle('');
            setDetails('');

            const newNote = { id: docRef.id, title, details }; // Include the document ID
            setNotes(prevNotes => [...prevNotes, newNote]);
        } catch (error) {
            console.error("Error adding note: ", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(firestore, "notes", id)); // Delete the note from Firestore
            setNotes(prevNotes => prevNotes.filter(note => note.id !== id)); // Update local state
        } catch (error) {
            console.error("Error deleting note: ", error);
        }
    };

    return (
        <Box display="flex" flexDirection="row">
            <Box height="100vh" width="250px">
                <Sidebar openSidebarToggle={sidebarOpen} OpenSidebar={handleSidebarToggle}/>
            </Box>
            <Box m="20px" flexGrow={1}>
                <Header OpenSidebar={handleSidebarToggle}
                    messageCount={messageCount}
                    setMessageCount={setMessageCount} 
                />
                <div className="note-container">
                    <h1>Admin Notepad</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Title:</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <label>Details:</label>
                            <textarea value={details} onChange={(e) => setDetails(e.target.value)} required></textarea>
                        </div>
                        <button type="submit">Add Note</button>
                    </form>
                    <div className="note-list">
                        {notes.map(note => (
                            <div className="note-item" key={note.id}>
                                <h3>{note.title}</h3>
                                <p>{note.details}</p>
                                <button onClick={() => handleDelete(note.id)}>Delete</button> {/* Delete button */}
                            </div>
                        ))}
                    </div>
                </div>
            </Box>
        </Box>
    );
};

export default Note;
