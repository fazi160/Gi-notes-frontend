import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NoteList = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

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

  const detailView = (note) => {
    navigate("/viewnotes", {
      state: { id: note.id, title: note.title, body: note.body },
    });
  };
  //   const navigate = useNavigate()
  const create = () => {
    navigate("/create");
  };

  return (
    <div className="p-10">
      <button
        className="px-4 py-2 border rounded-md mt-8 mb-8 shadow-inner shadow-slate-200 hover:bg-black hover:text-white hover:shadow-slate-300 hover:shadow-lg"
        onClick={create}
      >
        Add Note
      </button>
      <br />
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
                    onClick={() => detailView(note)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteList;
