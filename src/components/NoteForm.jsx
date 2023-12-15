import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const NoteForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state || {};
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [noteTitle, setNoteTitle] = useState(data.title || "");
  const [noteBody, setNoteBody] = useState(data.body || "");

  useEffect(() => {
    if (location.pathname.includes("/viewnotes/edit")) {
      const noteId = location.pathname.split("/").pop();
    }
  }, [location.pathname]);

  const handleAddNote = async () => {
    if (noteTitle.trim() !== "" && noteBody.trim() !== "") {
      try {
        const response = await axios.post(`${baseUrl}/`, {
          title: noteTitle,
          body: noteBody,
        });

        if (response.data?.id && response.data.title && response.data.body) {
          // Handle successful addition, if needed
          setNoteTitle("");
          setNoteBody("");
          navigate("/");
        } else {
          console.error("Invalid response structure from API:", response.data);
        }
      } catch (error) {
        console.error("Error adding note:", error);
      }
    }
  };

  const handleEditNote = async () => {
    if (data.id) {
      try {
        const response = await axios.put(`${baseUrl}/${data.id}/`, {
          title: noteTitle || data.title,
          body: noteBody || data.body,
        });

        if (response.data?.id && response.data.title && response.data.body) {
          // Handle successful edit, if needed
          setNoteTitle("");
          setNoteBody("");
          navigate("/viewnotes", {
            state: {
              id: response.data.id,
              title: response.data.title,
              body: response.data.body,
            },
          });
        } else {
          console.error("Invalid response structure from API:", response.data);
        }
      } catch (error) {
        console.error("Error editing note:", error);
      }
    }
  };

  return (
    <div className="p-10">
      <input
        className="text-lg font-semibold w-full py-2 px-4 mb-2 rounded-md border focus:outline-none focus:border-blue-400 bg-blue-50"
        type="text"
        placeholder="Title"
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
      />
      <br />

      <textarea
        className="mt-5 w-full py-2 px-4 mb-2 rounded-md border focus:outline-none focus:border-blue-400 bg-blue-50"
        rows="8"
        placeholder="Type your note here..."
        value={noteBody}
        onChange={(e) => setNoteBody(e.target.value)}
      />

      <div className="flex justify-between mt-4">
        {data.id ? (
          <>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
              onClick={handleEditNote}
            >
              Save
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
              onClick={() =>
                navigate("/viewnotes", {
                  state: {
                    id: data.id,
                    title: data.title,
                    body: data.body,
                  },
                })
              }
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
              onClick={handleAddNote}
            >
              Add Note
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NoteForm;
