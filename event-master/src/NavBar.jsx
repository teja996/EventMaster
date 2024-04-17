import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <nav className="nav-bar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/MoreInfo">MoreInfo</Link></li>
            </ul>
        </nav>
    );
}

export default NavBar;
