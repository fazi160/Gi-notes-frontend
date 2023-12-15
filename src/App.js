import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/notes/');
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/notes/${id}/`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEditClick = (note) => {
    setSelectedNote(note);
    setModalIsOpen(true);
  };

  const handleAddNote = async () => {
    if (noteTitle.trim() !== '' && noteBody.trim() !== '') {
      try {
        const response = await axios.post('http://127.0.0.1:8000/notes/', {
          title: noteTitle,
          body: noteBody,
        });

        if (
          response.data &&
          response.data.id &&
          response.data.title &&
          response.data.body
        ) {
          setNotes((prevNotes) => [...prevNotes, response.data]);
          setModalIsOpen(false);
          setNoteTitle('');
          setNoteBody('');
        } else {
          console.error('Invalid response structure from API:', response.data);
        }
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  };

  const handleEditNote = async () => {
    if (selectedNote) {
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/notes/${selectedNote.id}/`,
          {
            title: noteTitle || selectedNote.title,
            body: noteBody || selectedNote.body,
          }
        );

        if (
          response.data &&
          response.data.id &&
          response.data.title &&
          response.data.body
        ) {
          setNotes((prevNotes) =>
            prevNotes.map((note) =>
              note.id === selectedNote.id ? response.data : note
            )
          );
          setModalIsOpen(false);
          setSelectedNote(null);
          setNoteTitle('');
          setNoteBody('');
        } else {
          console.error('Invalid response structure from API:', response.data);
        }
      } catch (error) {
        console.error('Error editing note:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setSelectedNote(null);
    setModalIsOpen(false);
    setNoteTitle('');
    setNoteBody('');
  };

  return (
    <div className="p-10 overflow-x-hidden">
      <button
        className="px-4 py-2 border rounded-md mt-8 mb-8 shadow-inner shadow-slate-200 hover:bg-black hover:text-white hover:shadow-slate-300 hover:shadow-lg"
        onClick={() => {
          setModalIsOpen(true);
          setSelectedNote(null);
        }}
      >
        Add Note
      </button>

      <div className="flex items-center w-screen">
        <div className="flex flex-wrap gap-10">
          {notes.map((note) => (
            <div
              key={note.id}
              className=" bg-yellow-100 p-4 rounded-md shadow-md overflow-hidden w-80"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <p className="border-b border-yellow-300 pb-2 h-20 overflow-hidden">
                  {note.body}
                </p>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditClick(note)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCancelEdit}
        style={customStyles}
        contentLabel={selectedNote ? 'Edit Note Modal' : 'Add Note Modal'}
      >
        <div>
          <input
            className="text-lg font-semibold"
            type="text"
            placeholder="Title"
            value={selectedNote ? noteTitle || selectedNote.title : noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
          <br />
          
          <textarea
          className='mt-5'
            rows="8"
            placeholder="Type your note here..."
            value={selectedNote ? noteBody || selectedNote.body : noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
          />
          
          <div className="flex justify-between">
            <button
              className="text-green-500"
              onClick={selectedNote ? handleEditNote : handleAddNote}
            >
              {selectedNote ? 'Save' : 'Add Note'}
            </button>
            <button className="text-red-500" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;
