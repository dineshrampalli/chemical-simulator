import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_ELEMENTS = gql`
  query GetElements {
    elements {
      id
      symbol
    }
  }
`;

function EquationBalancer() {
  const [equation, setEquation] = useState('');
  const [balancedEquation, setBalancedEquation] = useState('');
  const { loading, error, data } = useQuery(GET_ELEMENTS);

  const parseEquation = (eq) => {
    const sides = eq.split('=');
    if (sides.length !== 2) return null;

    const parseSide = (side) => {
      return side.trim().split('+').map(compound => compound.trim());
    };

    return {
      reactants: parseSide(sides[0]),
      products: parseSide(sides[1])
    };
  };

  const balanceEquation = () => {
    const parsed = parseEquation(equation);
    if (!parsed) {
      setBalancedEquation('Invalid equation format');
      return;
    }

    // This is a placeholder for the actual balancing logic
    // In a real implementation, you'd need to implement a more complex algorithm
    setBalancedEquation(`Balanced: ${equation}`);
};

if (loading) return <p>Loading elements...</p>;
if (error) return <p>Error loading elements: {error.message}</p>;

return (
  <div>
    <h2>Chemical Equation Balancer</h2>
    <input
      type="text"
      value={equation}
      onChange={(e) => setEquation(e.target.value)}
      placeholder="Enter equation (e.g., H2 + O2 = H2O)"
    />
    <button onClick={balanceEquation}>Balance Equation</button>
    {balancedEquation && <p>{balancedEquation}</p>}
    <p>Available elements: {data.elements.map(el => el.symbol).join(', ')}</p>
  </div>
);
}

export default EquationBalancer;