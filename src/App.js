import React from 'react';
import Homepage from './Homepage';
import Quiz from './Quiz';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <div>      
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/quiz" element={<Quiz />} />          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
