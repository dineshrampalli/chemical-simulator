const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const { connectDB } = require('./db');
const cors = require('cors');

async function startServer() {
  const app = express();
  
  app.use(cors());

  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // You can add context here, such as authenticated user info
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();