import request from "supertest";
import app from "../app";

describe("Auth API", () => {
  const base = "/api/auth";

  it("signs up a new user and returns token + user", async () => {
    const res = await request(app).post(`${base}/signup`).send({
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toMatchObject({
      email: "test@example.com",
      name: "Test User"
    });
  });

  it("prevents signing up with existing email", async () => {
    const res = await request(app).post(`${base}/signup`).send({
      name: "Another User",
      email: "test@example.com",
      password: "password123"
    });

    expect(res.status).toBe(400);
  });

  it("signs in an existing user", async () => {
    const res = await request(app).post(`${base}/signin`).send({
      email: "test@example.com",
      password: "password123"
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
  });
}
);

