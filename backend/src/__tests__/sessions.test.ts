import request from "supertest";
import app from "../app";

describe("Sessions API", () => {
  let token: string;

  beforeAll(async () => {
    const signupRes = await request(app).post("/api/auth/signup").send({
      name: "Session User",
      email: "session@example.com",
      password: "password123"
    });
    token = signupRes.body.token;
  });

  it("creates a new session and returns it", async () => {
    const res = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        role: "Frontend Engineer",
        level: "Mid"
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.role).toBe("Frontend Engineer");
  });

  it("lists sessions for the authenticated user", async () => {
    const res = await request(app)
      .get("/api/sessions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

