import React, { useState, useEffect } from "react";
import axios from "axios";

const Notes = ({ token }) => {
  const [notes, setNotes] = useState([]);
  const [description, setDescription] = useState("");
  const [editNote, setEditNote] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  // Fetch Notes
  useEffect(() => {

    const newToken = localStorage.getItem("authToken");

    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/notes", {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        setNotes(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotes();
  }, [token]);

  // Add Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/notes",
        { description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([...notes, response.data]);
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  // Delete Note
  const handleDeleteNote = async (note_id) => {
    try {
      await axios.delete(`http://localhost:5000/notes/${note_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note.note_id !== note_id));
    } catch (error) {
      console.error(error);
    }
  };

  // Update Note
  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/notes/${editNote.note_id}`,
        { description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(
        notes.map((note) =>
          note.note_id === editNote.note_id
            ? { ...note, description: editDescription }
            : note
        )
      );
      setEditNote(null);
      setEditDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Notes</h2>
      <form
        onSubmit={handleAddNote}
        className="mb-6 flex items-center space-x-4"
      >
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a new note"
          required
          className="border border-gray-300 rounded-lg p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Note
        </button>
      </form>
      <ul className="space-y-4">
        {notes.map((note) => (
          <li
            key={note.note_id}
            className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow"
          >
            <span className="flex-grow">{note.description}</span>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setEditNote(note);
                  setEditDescription(note.description);
                }}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteNote(note.note_id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {editNote && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Edit Note</h3>
            <form onSubmit={handleUpdateNote}>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditNote(null)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
