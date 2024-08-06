import React, { useEffect, useState } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage"
import AddNote from "./pages/AddNotes"
import NotePage from "./pages/NotePage"
import EditNote from './pages/EditNote';
import axios from 'axios';
import { toast } from 'react-toastify';
import filter from './components/filter';

const App = () => {

  const [notes, setNotes] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [searchText, setSearchText] = useState ("");

  const handleFilterText = (val) => {
    setFilterText(val);

  };

  const handleSearchText = (val) => {
    setSearchText(val);
  }

  const filteredNotes =
    filterText === "BUSINESS"
    ? notes.filter((note) => note.category == "BUSINESS")
    : filterText === "PERSONAL"
    ? notes.filter((note) => note.category == "PERSONAL")
    : filterText === "IMPORTANT"
    ? notes.filter((note) => note.category == "IMPORTANT")
    : notes;
 

    useEffect(() => {
      if(searchText.length < 3) return;
      axios.get(`http://127.0.0.1:8000/notes-search/?search=${searchText}`)
      .then(res => {
        console.log(res.data)
        setNotes(res.data)
      })
      .catch(err => console.log(err.message))
    }, [searchText])


  useEffect(() => {
    axios.get("http://127.0.0.1:8000/notes/")
    .then(res => {
      console.log(res.data)
      setNotes(res.data)
    })
    .catch(err => {
      console.log(err.message)
    });
  }, []);

  const addNote = (data) => {
      axios.post("http://127.0.0.1:8000/notes/",data)
      .then(res => {
        setNotes([...notes, data])
        toast.success("A new note has been added!!");
        console.log(res.data)
      })
      .catch(err =>(
        console.log(console.log(err.message))
      ));
  };

  const updateNote = (data, slug) => {
      axios
        .put(`http://127.0.0.1:8000/notes/${slug}/`, data)
        .then((res) => {
        console.log(res.data);
        toast.success("Note updated succesfully!!");
      })

      .catch((err) => console.log(err.message));
  };

  const deleteNote = (slug) =>{
    axios
    .delete(`http://127.0.0.1:8000/notes/${slug}/`)
    .catch((err) => console.log(err.message))
  }




  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<MainLayout searchText={searchText} handleSearchText={handleSearchText} />}>
      <Route index element={<HomePage  notes={filteredNotes} handleFilterText={handleFilterText} />} />
      <Route path="/add-note" element={<AddNote addNote={addNote}/>} />
      <Route path="/edit-note/:slug" element={<EditNote updateNote={updateNote}/>} />
      <Route path="/notes/:slug" element={<NotePage deleteNote={deleteNote}/>} />
    </Route>
  ))



  return <RouterProvider router={router} />
};

export default App;

