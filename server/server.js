import { ApolloServer } from "@apollo/server";
import cors from "cors";
import express from "express";
import { expressMiddleware as apolloMiddleware } from "@as-integrations/express5";
import { authMiddleware, handleLogin } from "./auth.js";
import { readFile } from "node:fs/promises";
import { resolvers } from "./resolvers.js";
import { getUser } from "./db/users.js";

const PORT = 4000;
const app = express();

app.use(cors(), express.json(), authMiddleware);
app.post("/login", handleLogin);

const typeDefs = await readFile("./schema.graphql", "utf8");
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const getContext = async ({ req, res }) => {
    if (req.auth) {
        const user = await getUser(req.auth.sub);
        return { user };
    }
    return {};
};

await server.start();
app.use("/graphql", apolloMiddleware(server, { context: getContext }));

app.listen({ port: PORT }, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
