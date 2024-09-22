const { ObjectId } = require('mongodb');
const { getDB } = require('./db');

function parseChemicalFormula(formula) {
  const elementRegex = /([A-Z][a-z]?)(\d*)/g;
  const elements = {};
  let match;

  while ((match = elementRegex.exec(formula)) !== null) {
    const [, element, count] = match;
    elements[element] = (elements[element] || 0) + (parseInt(count) || 1);
  }

  return elements;
}

const resolvers = {
  Query: {
    elements: async () => {
      const db = getDB();
      try {
        const elements = await db.collection('elements').find().toArray();
        return elements.map(element => ({
          ...element,
          id: element._id.toString()
        }));
      } catch (error) {
        console.error('Error fetching elements:', error);
        return [];
      }
    },
    element: async (_, { id }) => {
      const db = getDB();
      return await db.collection('elements').findOne({ _id: new ObjectId(id) });
    },
    elementBySymbol: async (_, { symbol }) => {
      const db = getDB();
      return await db.collection('elements').findOne({ symbol });
    },
    reactions: async () => {
      const db = getDB();
      return await db.collection('reactions').find().toArray();
    },
    reaction: async (_, { id }) => {
      const db = getDB();
      return await db.collection('reactions').findOne({ _id: new ObjectId(id) });
    },
    calculateMolarMass: async (_, { formula }) => {
      const db = getDB();
      const elements = parseChemicalFormula(formula);
      let molarMass = 0;

      for (const [symbol, count] of Object.entries(elements)) {
        const element = await db.collection('elements').findOne({ symbol });
        if (!element) {
          throw new Error(`Element not found: ${symbol}`);
        }
        molarMass += element.atomicMass * count;
      }

      return {
        formula,
        molarMass: parseFloat(molarMass.toFixed(4))
      };
    }
  },
  Mutation: {
    addElement: async (_, { name, symbol, atomicNumber, atomicMass, electronegativity, group, period }) => {
      const db = getDB();
      const result = await db.collection('elements').insertOne({
        name, symbol, atomicNumber, atomicMass, electronegativity, group, period
      });
      return {
        id: result.insertedId,
        name, symbol, atomicNumber, atomicMass, electronegativity, group, period
      };
    },
    addReaction: async (_, { name, reactantIds, productIds, equation }) => {
      const db = getDB();
      const reactants = await db.collection('elements').find({ _id: { $in: reactantIds.map(id => new ObjectId(id)) } }).toArray();
      const products = await db.collection('elements').find({ _id: { $in: productIds.map(id => new ObjectId(id)) } }).toArray();
      
      const result = await db.collection('reactions').insertOne({
        name,
        reactants,
        products,
        equation
      });

      return {
        id: result.insertedId,
        name,
        reactants,
        products,
        equation
      };
    },
  },
  Reaction: {
    reactants: async (parent) => {
      const db = getDB();
      return await db.collection('elements').find({ _id: { $in: parent.reactants.map(r => r._id) } }).toArray();
    },
    products: async (parent) => {
      const db = getDB();
      return await db.collection('elements').find({ _id: { $in: parent.products.map(p => p._id) } }).toArray();
    },
  },
};

module.exports = { resolvers };