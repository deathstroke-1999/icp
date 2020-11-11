import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  render() {

    return (
      <nav className="navbar navbar-expand-lg">
        <div className="collpase navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/" className="nav-link">Interviews</Link>
            </li>
            <li className="navbar-item">
              <Link to="/add" className="nav-link">Add Interview</Link>
            </li>
          </ul>
        </div>
      </nav >
    );
  }
}

export default Navbar;