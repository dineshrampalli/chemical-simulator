import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import Dashboard from './components/Dashboard';
import ElementLibrary from './components/ElementLibrary';
import Simulator from './components/Simulator';
import EquationBalancer from './components/EquationBalancer';
import MolarMassCalculator from './components/MolarMassCalculator';
import MoleculeVisualizer from './components/MoleculeVisualizer';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/elements">Element Library</Link></li>
              <li><Link to="/simulator">Simulator</Link></li>
              <li><Link to="/balancer">Equation Balancer</Link></li>
              <li><Link to="/molar-mass">Molar Mass Calculator</Link></li>
              <li><Link to="/visualizer">Molecule Visualizer</Link></li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/elements" element={<ElementLibrary />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/balancer" element={<EquationBalancer />} />
            <Route path="/molar-mass" element={<MolarMassCalculator />} />
            <Route path="/visualizer" element={<MoleculeVisualizer />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;