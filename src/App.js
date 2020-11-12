import React from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from "./Navbar";
import Heading from "./Heading";
import InterviewList from "./InterviewList";
import AddInterview from "./AddInterview";
import EditInterview from './EditInterview';


function App() {
  return (
    <div style={{
      backgroundColor: "#1E1E1E", minHeight: "100vh"
    }}>
      <Router>
        <div className="container">

          <Heading />
          <Navbar />
          <br />
          <Route path="/" exact component={InterviewList} />
          <Route path="/add" component={AddInterview} />
          <Route path="/edit" component={EditInterview} />
        </div>

      </Router >
    </div >
  );
}

export default App;

// npm i react - router - dom