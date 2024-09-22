import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_ELEMENTS = gql`
  query GetElements {
    elements {
      id
      name
      symbol
      atomicNumber
      atomicMass
      electronegativity
      group
      period
    }
  }
`;

const ADD_ELEMENT = gql`
  mutation AddElement($name: String!, $symbol: String!, $atomicNumber: Int!, $atomicMass: Float!, $electronegativity: Float, $group: Int, $period: Int) {
    addElement(name: $name, symbol: $symbol, atomicNumber: $atomicNumber, atomicMass: $atomicMass, electronegativity: $electronegativity, group: $group, period: $period) {
      id
      name
      symbol
      atomicNumber
    }
  }
`;

function ElementLibrary() {
  const { loading, error, data } = useQuery(GET_ELEMENTS);
  const [addElement] = useMutation(ADD_ELEMENT, {
    refetchQueries: [{ query: GET_ELEMENTS }],
  });

  const [newElement, setNewElement] = useState({
    name: '',
    symbol: '',
    atomicNumber: '',
    atomicMass: '',
    electronegativity: '',
    group: '',
    period: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewElement({ ...newElement, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addElement({
      variables: {
        ...newElement,
        atomicNumber: parseInt(newElement.atomicNumber),
        atomicMass: parseFloat(newElement.atomicMass),
        electronegativity: newElement.electronegativity ? parseFloat(newElement.electronegativity) : null,
        group: newElement.group ? parseInt(newElement.group) : null,
        period: newElement.period ? parseInt(newElement.period) : null,
      },
    });
    setNewElement({
      name: '',
      symbol: '',
      atomicNumber: '',
      atomicMass: '',
      electronegativity: '',
      group: '',
      period: '',
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Error fetching elements:', error);
    return (
      <div>
        <h1>Element Library</h1>
        <p>Error loading elements. Please try again later.</p>
        <p>Error details: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Element Library</h1>
      {data.elements.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Atomic Number</th>
              <th>Atomic Mass</th>
              <th>Electronegativity</th>
              <th>Group</th>
              <th>Period</th>
            </tr>
          </thead>
          <tbody>
            {data.elements.map(element => (
              <tr key={element.id}>
                <td>{element.name}</td>
                <td>{element.symbol}</td>
                <td>{element.atomicNumber}</td>
                <td>{element.atomicMass}</td>
                <td>{element.electronegativity}</td>
                <td>{element.group}</td>
                <td>{element.period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No elements found. Add some elements using the form below.</p>
      )}

      <h2>Add New Element</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={newElement.name} onChange={handleInputChange} placeholder="Name" required />
        <input name="symbol" value={newElement.symbol} onChange={handleInputChange} placeholder="Symbol" required />
        <input name="atomicNumber" type="number" value={newElement.atomicNumber} onChange={handleInputChange} placeholder="Atomic Number" required />
        <input name="atomicMass" type="number" step="0.0001" value={newElement.atomicMass} onChange={handleInputChange} placeholder="Atomic Mass" required />
        <input name="electronegativity" type="number" step="0.1" value={newElement.electronegativity} onChange={handleInputChange} placeholder="Electronegativity" />
        <input name="group" type="number" value={newElement.group} onChange={handleInputChange} placeholder="Group" />
        <input name="period" type="number" value={newElement.period} onChange={handleInputChange} placeholder="Period" />
        <button type="submit">Add Element</button>
      </form>
    </div>
  );
}

export default ElementLibrary;