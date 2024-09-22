const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Element {
    id: ID!
    name: String!
    symbol: String!
    atomicNumber: Int!
    atomicMass: Float!
    electronegativity: Float
    group: Int
    period: Int
  }

  type Reaction {
    id: ID!
    name: String!
    reactants: [Element!]!
    products: [Element!]!
    equation: String!
  }

  type CompoundMass {
    formula: String!
    molarMass: Float!
  }

  type Query {
    elements: [Element!]!
    element(id: ID!): Element
    elementBySymbol(symbol: String!): Element
    reactions: [Reaction!]!
    reaction(id: ID!): Reaction
    calculateMolarMass(formula: String!): CompoundMass!
  }

  type Mutation {
    addElement(
      name: String!
      symbol: String!
      atomicNumber: Int!
      atomicMass: Float!
      electronegativity: Float
      group: Int
      period: Int
    ): Element!

    addReaction(
      name: String!
      reactantIds: [ID!]!
      productIds: [ID!]!
      equation: String!
    ): Reaction!
  }
`;

module.exports = { typeDefs };