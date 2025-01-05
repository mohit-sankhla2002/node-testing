import express, { Express } from "express";
import { z } from "zod";
import { prismaClient } from "./db";

export const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const sumValidator = z.object({
  a: z.number(),
  b: z.number(),
});

app.post("/sum", async (req, res) => {
  const { success, data, error } = await sumValidator.safeParseAsync(req.body);

  if (!success) {
    res.status(411).json({
      error: error?.message,
    });
    return;
  }

  const { a, b } = data;
  const sum = a + b;

  await prismaClient.request.create({
    data: {
      a,
      b,
      result: sum,
      type: "SUM",
    },
  });

  res.status(200).json({
    answer: sum,
  });
});

app.post("/sum-with-id", async (req, res) => {
  const { success, data, error } = await sumValidator.safeParseAsync(req.body);

  if (!success) {
    res.status(411).json({
      error: error?.message,
    });
    return;
  }

  const { a, b } = data;
  const sum = a + b;

  const dbRequest = await prismaClient.request.create({
    data: {
      a,
      b,
      result: sum,
      type: "SUM",
    },
  });

  res.status(200).json({
    answer: sum,
    id: dbRequest.id,
  });
});

app.post("/multiply", async (req, res) => {
  const { success, data, error } = await sumValidator.safeParseAsync(req.body);

  if (success === false) {
    res.status(411).json({
      error: error?.message,
    });
    return;
  }

  const { a, b } = data;

  const multiplication = a * b;

  const dbRequest = await prismaClient.request.create({
    data: {
      a: a,
      b: b,
      result: multiplication,
      type: "MULTIPLY",
    },
  });

  res.status(200).json({
    answer: multiplication,
    id: dbRequest.id,
  });
});
