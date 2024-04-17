import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import HomePage from './HomePage';
import MoreInfo from './MoreInfo';
import './App.css'

function App() {
    return (
        <Router>
            <div>
                <NavBar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/MoreInfo" element={<MoreInfo />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
