import express from "express";
import { prisma } from "../prisma/prisma-instance";
import { Dog } from "@prisma/client";
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
    return res
      .status(400)
      .json({ message: "id should be a number" });
  }

  const dog = await prisma.dog.findUnique({
    where: {
      id: +id,
    },
  });

  dog ? res.status(200).json(dog) : res.status(204).send();
});

// Create endpoint
app.post("/dogs", async (req, res) => {
  const body = req.body;
  const bodyKeys = Object.keys(body);
  const dogData = {
    name: body?.name,
    description: body?.description,
    breed: body?.breed,
    age: body?.age,
  };
  const { name, description, breed, age } = dogData;
  const errors = [];

  if (typeof age !== "number") {
    errors.push("age should be a number");
  }

  if (typeof name !== "string") {
    errors.push("name should be a string");
  }

  if (typeof description !== "string") {
    errors.push("description should be a string");
  }

  if (typeof breed !== "string") {
    errors.push("breed should be a string");
  }

  bodyKeys.map((key) => {
    if (
      key !== "name" &&
      key !== "description" &&
      key !== "breed" &&
      key !== "age"
    ) {
      errors.push(`'${key}' is not a valid key`);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const dog = await prisma.dog.create({
      data: dogData,
    });
    res.status(201).json(dog);
  } catch (error) {
    res.status(500).json(error);
  }
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;

app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
