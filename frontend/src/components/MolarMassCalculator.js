import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';

const CALCULATE_MOLAR_MASS = gql`
  query CalculateMolarMass($formula: String!) {
    calculateMolarMass(formula: $formula) {
      formula
      molarMass
    }
  }
`;

function MolarMassCalculator() {
  const [formula, setFormula] = useState('');
  const [calculateMolarMass, { loading, error, data }] = useLazyQuery(CALCULATE_MOLAR_MASS);

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateMolarMass({ variables: { formula } });
  };

  return (
    <div>
      <h2>Molar Mass Calculator</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Enter chemical formula (e.g., H2O)"
          required
        />
        <button type="submit">Calculate</button>
      </form>
      {loading && <p>Calculating...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          <h3>Result:</h3>
          <p>Formula: {data.calculateMolarMass.formula}</p>
          <p>Molar Mass: {data.calculateMolarMass.molarMass} g/mol</p>
        </div>
      )}
    </div>
  );
}

export default MolarMassCalculator;