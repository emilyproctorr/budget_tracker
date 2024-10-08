import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Expenses from './components/Expenses';
import Navbar from './components/Navbar';
import Income from './components/Income';

function App() {
  return (
    <>
     <Navbar/>
     <hr className='divider'/>
       <div>
          {/* routes looks through child routes to find best match and renders that branch of ui */}
          <Routes>        
            <Route path="/"  element={<Home/>} />
            <Route path="/expenses"  element={<Expenses />}/>
            <Route path="/income"  element={<Income />}/>
          </Routes>
        </div>
     </>
    
   );
}

export default App;
