import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxHeight: "80vh",
    overflow: "auto",
    backgroundColor: "rgba(255, 255, 204, 0.8)",
  },
};

const App = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${baseUrl}/`);
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, [baseUrl]);

  const deleteNoteWithConfirmation = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (confirmation) {
      try {
        await axios.delete(`${baseUrl}/${id}/`);
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        setDetailModalIsOpen(false);
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const openDetailModal = (data) => {
    setSelectedData(data);
    setDetailModalIsOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedData(null);
    setDetailModalIsOpen(false);
  };

  const handleEditClick = (note) => {
    setSelectedNote(note);
    setModalIsOpen(true);
  };

  const handleAddNote = async () => {
    if (noteTitle.trim() !== "" && noteBody.trim() !== "") {
      try {
        const response = await axios.post(`${baseUrl}/`, {
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
          setNoteTitle("");
          setNoteBody("");
        } else {
          console.error("Invalid response structure from API:", response.data);
        }
      } catch (error) {
        console.error("Error adding note:", error);
      }
    }
  };

  const handleEditNote = async () => {
    if (selectedNote) {
      try {
        const response = await axios.put(`${baseUrl}/${selectedNote.id}/`, {
          title: noteTitle || selectedNote.title,
          body: noteBody || selectedNote.body,
        });

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
          setNoteTitle("");
          setNoteBody("");
        } else {
          console.error("Invalid response structure from API:", response.data);
        }
      } catch (error) {
        console.error("Error editing note:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setSelectedNote(null);
    setModalIsOpen(false);
    setNoteTitle("");
    setNoteBody("");
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
                  {note.body.length > 100
                    ? `${note.body.slice(0, 100)}...`
                    : note.body}
                </p>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={() => openDetailModal(note)}
                  >
                    View
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
        contentLabel={selectedNote ? "Edit Note Modal" : "Add Note Modal"}
      >
        <div>
          <input
            className="text-lg font-semibold w-full bg-blue-50"
            type="text"
            placeholder="Title"
            value={selectedNote ? noteTitle || selectedNote.title : noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
          <br />

          <textarea
            className="mt-5 w-full bg-blue-50"
            rows="8"
            placeholder="Type your note here..."
            value={selectedNote ? noteBody || selectedNote.body : noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
          />

          <div className="flex justify-between">
            <button
              className="border rounded-md text-green-500"
              onClick={selectedNote ? handleEditNote : handleAddNote}
            >
              {selectedNote ? "Save" : "Add Note"}
            </button>
            <button
              className="border rounded-md text-red-500"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={detailModalIsOpen}
        onRequestClose={closeDetailModal}
        style={customStyles}
        contentLabel="View Details Modal"
      >
        {selectedData && (
          <div>
            <div className="flex justify-end">
              <button
                className="border rounded-md mt-4"
                onClick={closeDetailModal}
              >
                <CloseIcon fontSize="large"/>
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-4">{selectedData.title}</h2>
            <div
              className="mb-4"
              dangerouslySetInnerHTML={{
                __html: selectedData.body.replace(/\n/g, "<br>"),
              }}
            />
            <div className="flex justify-between">
              <button
                className="border rounded-md text-blue-500"
                onClick={() => {
                  handleEditClick(selectedData);
                  closeDetailModal();
                }}
              >
                <EditIcon fontSize="large"/>
              </button>
              <button
                className="border rounded-md text-red-500"
                onClick={() => deleteNoteWithConfirmation(selectedData.id)}
              >
                <DeleteIcon fontSize="large"/>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );


  
};

export default App;
