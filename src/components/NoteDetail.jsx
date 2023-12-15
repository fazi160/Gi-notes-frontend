import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Link } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Swal from "sweetalert2";

const NoteDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state || {};
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const deleteNoteWithConfirmation = async (id) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmation.isConfirmed) {
      try {
        await axios.delete(`${baseUrl}/${id}/`);
        console.log("Note deleted successfully");
        navigate("/");
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const editNotes = () => {
    navigate("/viewnotes/edit", {
      state: { id: data.id, title: data.title, body: data.body },
    });
  };

  return (
    <>
      <Link to={"/"}>
        <button className="p-10">
          <ArrowBackIosNewIcon fontSize="large" />{" "}
        </button>
      </Link>
      <div className="mx-auto max-w-2xl">
        {data && (
          <div className="bg-white p-8 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              {data.title}
            </h2>
            <div
              className="mb-4"
              dangerouslySetInnerHTML={{
                __html: data.body.replace(/\n/g, "<br>"),
              }}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="border rounded-md text-blue-500"
                onClick={editNotes}
              >
                <EditIcon fontSize="large" />
              </button>
              <button
                className="border rounded-md text-red-500"
                onClick={() => deleteNoteWithConfirmation(data.id)}
              >
                <DeleteIcon fontSize="large" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NoteDetail;
