import React from 'react';
import {Link} from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <div className='navigation-bar'>
            <div className='income-text'>
                <Link to="/income">Income</Link>
            </div>
            <div className='expenses-text'>
                <Link to="/expenses">Expenses</Link>
            </div>
            <div className='home-text'>
                <Link to="/">Home</Link>
            </div>
        </div>
    );
  }
  
  export default Navbar;