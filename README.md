# Node Testing with Vitest

This repository demonstrates testing practices in Node.js using Vitest, with a focus on API endpoint testing and mocking strategies.

## Features

- Express API endpoint testing using `supertest`
- Database interaction mocking with Prisma
- Different mocking strategies (shallow mocking vs deep mocks)
- Test organization using `describe` and `it` blocks

## Project Structure

```
├── src/
│   ├── __mocks__/
│   │   └── db.ts          # Mock implementations
│   ├── db.ts              # Database connection
│   |── index.ts           # Express application
|   └── bin.ts             # Main Binary to run the app
├── tests/
│   └── index.test.ts        # API endpoint tests
```

## Key Concepts Demonstrated

### 1. Basic Endpoint Testing

Testing simple endpoints using supertest:

```typescript
describe("GET /", async () => {
  it("should return 200 and Hello World!", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World!");
  });
});
```

### 2. Input Validation Testing

Testing endpoints with different input scenarios:

```typescript
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
```

### 3. Mocking Strategies

#### Shallow Mocking
Direct mocking of modules:

```typescript
vi.mock("../db", () => {
  return {
    prismaClient: {
      request: {
        create: vi.fn(),
      },
    },
  };
});
```

#### Deep Mocking
Using dedicated mock files in `__mocks__` folder:

```typescript
vi.mock("../db");
```

### 4. Mock Response Testing

Testing endpoints with mocked database responses:

```typescript
prismaClient.request.create.mockResolvedValue({
  id: 1,
  a: 1,
  b: 2,
  result: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run tests:
   ```bash
   npm test
   ```

## Dependencies

- Vitest: Testing framework
- Supertest: HTTP testing
- Prisma: Database ORM
- Express: Web framework

## Best Practices Demonstrated

1. **Test Organization**: Using describe blocks to group related tests
2. **Input Validation**: Testing both valid and invalid inputs
3. **Mocking**: Different strategies for mocking dependencies
4. **HTTP Testing**: Using supertest for API endpoint testing
5. **Database Mocking**: Mocking Prisma client for database operations

## License

MIT
