import request from "supertest";
import app from "../app";

describe("Integration Tests", () => {
  describe("Health Check", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status", "ok");
    });
  });

  describe("Authentication Flow", () => {
    let authToken: string;
    let userId: string;

    it("should sign up a new user", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "Test User",
          email: `test${Date.now()}@example.com`,
          password: "password123"
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user).toHaveProperty("email");

      authToken = res.body.token;
      userId = res.body.user.id;
    });

    it("should sign in with correct credentials", async () => {
      const email = `test${Date.now()}@example.com`;
      const password = "password123";

      // First sign up
      await request(app)
        .post("/api/auth/signup")
        .send({ name: "Test User", email, password });

      // Then sign in
      const res = await request(app)
        .post("/api/auth/signin")
        .send({ email, password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user.email).toBe(email);
    });

    it("should reject sign in with wrong password", async () => {
      const email = `test${Date.now()}@example.com`;
      const password = "password123";

      // Sign up first
      await request(app)
        .post("/api/auth/signup")
        .send({ name: "Test User", email, password });

      // Try to sign in with wrong password
      const res = await request(app)
        .post("/api/auth/signin")
        .send({ email, password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });

    it("should create a session when authenticated", async () => {
      const email = `test${Date.now()}@example.com`;
      const password = "password123";

      // Sign up and get token
      const signUpRes = await request(app)
        .post("/api/auth/signup")
        .send({ name: "Test User", email, password });

      const token = signUpRes.body.token;

      // Create session
      const res = await request(app)
        .post("/api/sessions")
        .set("Authorization", `Bearer ${token}`)
        .send({ role: "Software Engineer", level: "Mid" });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("role", "Software Engineer");
      expect(res.body).toHaveProperty("level", "Mid");
      expect(res.body).toHaveProperty("status", "pending");
    });

    it("should reject creating session without auth", async () => {
      const res = await request(app)
        .post("/api/sessions")
        .send({ role: "Software Engineer", level: "Mid" });

      expect(res.status).toBe(401);
    });

    it("should get user sessions when authenticated", async () => {
      const email = `test${Date.now()}@example.com`;
      const password = "password123";

      // Sign up and get token
      const signUpRes = await request(app)
        .post("/api/auth/signup")
        .send({ name: "Test User", email, password });

      const token = signUpRes.body.token;

      // Create a session
      await request(app)
        .post("/api/sessions")
        .set("Authorization", `Bearer ${token}`)
        .send({ role: "Software Engineer", level: "Mid" });

      // Get sessions
      const res = await request(app)
        .get("/api/sessions")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("should get session questions", async () => {
      const email = `test${Date.now()}@example.com`;
      const password = "password123";

      // Sign up and get token
      const signUpRes = await request(app)
        .post("/api/auth/signup")
        .send({ name: "Test User", email, password });

      const token = signUpRes.body.token;

      // Create a session
      const sessionRes = await request(app)
        .post("/api/sessions")
        .set("Authorization", `Bearer ${token}`)
        .send({ role: "Software Engineer", level: "Mid" });

      const sessionId = sessionRes.body.id;

      // Get questions
      const res = await request(app)
        .get(`/api/sessions/${sessionId}/questions`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("text");
      expect(res.body[0]).toHaveProperty("order");
    });
  });

  describe("Reset Password", () => {
    it("should accept password reset request", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
    });
  });
});
