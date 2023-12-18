import express from "express";
import { prisma } from "../prisma/prisma-instance";
import { errorHandleMiddleware } from "./error-handler";
import "express-async-errors";

const app = express();
app.use(express.json());
// All code should go below this line
// Default endpoint -- Delete before turn in
app.get("/", (req, res) => {
  res.send("<h1>Server Up & Running</h1>");
});

// Index endpoint
app.get("/dogs", async (req, res) => {
  const dogs = await prisma.dog.findMany();
  res.status(200).json(dogs);
});

// Show endpoint
app.get("/dogs/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(+id)) {
    return res.status(400).json({ message: "id should be a number" });
  }

  const dog = await prisma.dog.findUnique({
    where: {
      id: +id,
    },
  });
  
  dog 
    ? res.status(200).json(dog) 
    : res.status(204).send();
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;

app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
