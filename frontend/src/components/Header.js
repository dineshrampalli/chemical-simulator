import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/elements">Element Library</Link></li>
          <li><Link to="/simulator">Simulator</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
