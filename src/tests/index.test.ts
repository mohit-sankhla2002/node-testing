import { expect, it, describe, vi } from "vitest";
import request from "supertest";
import { app } from "..";
import { prismaClient } from "../__mocks__/db";

// SHALLOW MOCKING
// vi.mock("../db", () => {
//   return {
//     prismaClient: {
//       request: {
//         create: vi.fn(),
//       },
//     },
//   };
// });

// USING DEEP MOCKS OUT OF THE __mocks__ FOLDER
vi.mock("../db");

describe("GET /", async () => {
  it("should return 200 and Hello World!", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World!");
  });
});

describe("sum endpoint", async () => {
  it("should return the sum of two numbers", async () => {
    const res = await request(app).post("/sum").send({
      a: 1,
      b: 2,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
  });

  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).post("/sum").send();
    expect(res.statusCode).toBe(411);
  });
});

describe("sum-with-id endpoint", async () => {
  // The below test case returns an error because we are mocking the prisma client but it's expecting a reponse from the prisma client to work as we wish
  //   it("should return the sum of two numbers and an id", async () => {
  //     const res = await request(app).post("/sum-with-id").send({
  //       a: 1,
  //       b: 2,
  //     });
  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.answer).toBe(3);
  //     expect(res.body.id).toBeDefined();
  //   });

  it("should return the sum of two numbers and an id", async () => {
    // here we'll add a resolved value before calling the script

    prismaClient.request.create.mockResolvedValue({
      id: 1,
      a: 1,
      b: 2,
      result: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: "SUM",
    });

    const res = await request(app).post("/sum-with-id").send({
      a: 1,
      b: 2,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
    expect(res.body.id).toBeDefined();
    expect(res.body.id).toBe(1);
  });

  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).post("/sum-with-id").send();
    expect(res.statusCode).toBe(411);
  });
});

describe("multiply endpoint", async () => {
  it("should return the multiplication of two numbers and an id", async () => {
    prismaClient.request.create.mockResolvedValue({
      id: 1,
      a: 3,
      b: 2,
      result: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: "MULTIPLY",
    });

    vi.spyOn(prismaClient.request, "create");

    const res = await request(app).post("/multiply").send({
      a: 3,
      b: 2,
    });

    expect(prismaClient.request.create).toHaveBeenCalledWith({
      data: {
        a: 3,
        b: 2,
        result: 6,
        type: "MULTIPLY",
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(6); // Was expecting 3 instead of 6
  });

  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).post("/multiply").send(); // Was using wrong endpoint
    expect(res.statusCode).toBe(411);
  });
});
