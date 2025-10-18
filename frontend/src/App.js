import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/notes/${editingId}`, { title, content });
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/notes`, { title, content });
      }
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 Notes App</h1>
      </header>
      
      <main className="container">
        <form onSubmit={handleSubmit} className="note-form">
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button type="submit">
            {editingId ? 'Update Note' : 'Add Note'}
          </button>
          {editingId && (
            <button type="button" onClick={() => {
              setEditingId(null);
              setTitle('');
              setContent('');
            }}>
              Cancel
            </button>
          )}
        </form>

        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <small>Created: {new Date(note.created_at).toLocaleDateString()}</small>
              <div className="note-actions">
                <button onClick={() => handleEdit(note)}>Edit</button>
                <button onClick={() => handleDelete(note.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
