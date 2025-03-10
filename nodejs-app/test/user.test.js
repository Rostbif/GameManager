// filepath: c:\Users\ofira\Documents\Programming Projects\GameManager\nodejs-app\test\user.test.js
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app"; // Assuming your Express app is exported from app.js
import User from "../src/models/userModel"; // Assuming you have a User model

describe("User API", () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect("mongodb://localhost:27017/testdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect from the test database
    await mongoose.disconnect();
  });

  afterEach(async () => {
    // Clean up the database after each test
    await User.deleteMany({});
  });

  it("should create a new user", async () => {
    const res = await request(app).post("/users").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("name", "John Doe");
  });

  it("should get a user by ID", async () => {
    const user = new User({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
    });
    await user.save();

    const res = await request(app).get(`/users/${user._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("name", "Jane Doe");
  });

  it("should add points to a user", async () => {
    const user = new User({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      points: 0,
    });
    await user.save();

    const res = await request(app)
      .post(`/users/${user._id}/points`)
      .send({ points: 10 });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("points", 10);
  });

  it("should create a purchase for a user", async () => {
    const user = new User({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
    });
    await user.save();

    const res = await request(app)
      .post(`/users/${user._id}/purchases`)
      .send({ item: "Book", amount: 20 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("purchase");
    expect(res.body.purchase).toHaveProperty("item", "Book");
  });
});
