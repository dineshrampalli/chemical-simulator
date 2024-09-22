import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { MolViewer } from 'react-molviewer';

const GET_ELEMENT_BY_SYMBOL = gql`
  query GetElementBySymbol($symbol: String!) {
    elementBySymbol(symbol: $symbol) {
      symbol
      atomicNumber
    }
  }
`;

function MoleculeVisualizer() {
  const [formula, setFormula] = useState('');
  const [moleculeData, setMoleculeData] = useState(null);
  const [getElement] = useLazyQuery(GET_ELEMENT_BY_SYMBOL);

  const parseFormula = async (formula) => {
    const elementRegex = /([A-Z][a-z]?)(\d*)/g;
    let match;
    let atoms = [];
    let position = { x: 0, y: 0, z: 0 };

    while ((match = elementRegex.exec(formula)) !== null) {
      const [, element, count] = match;
      const { data } = await getElement({ variables: { symbol: element } });
      
      if (data && data.elementBySymbol) {
        const quantity = parseInt(count) || 1;
        for (let i = 0; i < quantity; i++) {
          atoms.push({
            symbol: element,
            atomicNumber: data.elementBySymbol.atomicNumber,
            position: { ...position }
          });
          position.x += 1; // Simple positioning, not chemically accurate
        }
      }
    }

    return atoms;
  };

  const handleVisualize = async () => {
    const atoms = await parseFormula(formula);
    setMoleculeData({ atoms });
  };

  return (
    <div>
      <h2>Molecule Visualizer</h2>
      <input
        type="text"
        value={formula}
        onChange={(e) => setFormula(e.target.value)}
        placeholder="Enter chemical formula (e.g., H2O)"
      />
      <button onClick={handleVisualize}>Visualize</button>
      {moleculeData && (
        <div style={{ width: '100%', height: '400px' }}>
          <MolViewer
            modelData={moleculeData}
            backgroundColor="#FFFFFF"
          />
        </div>
      )}
    </div>
  );
}

export default MoleculeVisualizer;