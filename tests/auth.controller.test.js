const request = require("supertest");
const express = require("express");
const app = express();
const { regester} = require("../controller/auth/auth.controller");
const User = require("../model/user.model");

jest.mock("../model/user.model");
jest.mock("../util/HashPassword.js");
jest.mock("../util/createToken.js");

const HashPassword = require("../util/HashPassword");
const CreateToken = require("../util/createToken");

app.use(express.json());
app.post("/api/auth/register", regester);

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should process req.body and create a new user", async () => {
    const userData = {
      name: "bilanox",
      email: "aurabilanox@gmail.com",
      password: "12345672228",
      confirmPassword: "12345672228",
      phone: "0749101079",
    };

    HashPassword.mockResolvedValue("hashed_password");
    User.create.mockResolvedValue({
      _id: "user_id",
      ...userData,
      role: "client",
    });
    CreateToken.mockReturnValue("mocked_token");

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.message).toBe("User created successfully!");
    expect(response.body.user).toBeDefined();
    expect(response.body.token).toBeDefined();

    expect(HashPassword).toHaveBeenCalledWith(userData.password);
    expect(User.create).toHaveBeenCalledWith({
      ...userData,
      role: "client",
      slug: "bilanox",
      password: "hashed_password",
    });
    expect(CreateToken).toHaveBeenCalledWith("user_id", "5m");
  });

  it("should return an error if registration fails", async () => {
    const userData = {
      name: "bilanox",
      email: "aurabilanox@gmail.com",
      password: "12345672228",
      confirmPassword: "12345672228",
      phone: "0749101079",
    };

    User.create.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(400);

    expect(response.body.message).toBe("An error occurred during registration");
  });
});
