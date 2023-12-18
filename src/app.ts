import express from "express";
import { prisma } from "../prisma/prisma-instance";
import { errorHandleMiddleware } from "./error-handler";
import "express-async-errors";

const app = express();
app.use(express.json());
// All code should go below this line
// Default endpoint
app.get("/", (req, res) => {
  res.send("<h1>Server Up & Running</h1>");
});

// Index endpoint
app.get("/dogs", async (req, res) => {
  const dogs = await prisma.dog.findMany();
  res.json(dogs);
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
