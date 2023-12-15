import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import NoteDetail from "./components/NoteDetail";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
const App = () => {

  return (
    <div>
     

      
    <Router>
      <Routes>
        <Route path="/" element={<NoteList />} />
        <Route path="/viewnotes" element={<NoteDetail />} />
        <Route path="/viewnotes/edit" element={<NoteForm />} />
        <Route path="/create" element={<NoteForm />} />
      </Routes>
    </Router>
    </div>
  );
};

export default App;
