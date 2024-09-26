const request = require("supertest");
const express = require("express");
const app = express();
const { regester } = require("../controller/auth/auth.controller"); 
const User = require("../model/user.model");
const HashPassword = require("../util/HashPassword");
const CreateToken = require("../util/createToken");
const envoyerEmail = require("../util/mail"); 
const slug = require("slug"); 

jest.mock("../model/user.model");
jest.mock("../util/HashPassword");
jest.mock("../util/createToken");
jest.mock("../util/mail");
jest.mock("slug");

app.use(express.json());
app.post("/api/auth/register", regester);

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("should process req.body and create a new user with a token", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
      confirmPassword: "securepassword",
      phone: "123456789",
    };

    // محاكاة دوال
    slug.mockReturnValue("john-doe");
    HashPassword.mockResolvedValue("hashed_password");

    User.create.mockResolvedValue({
      _id: "user_id",
      ...userData,
      role: "client",
      slug: "john-doe",
    });

    CreateToken.mockReturnValue("mocked_token");

    envoyerEmail.mockResolvedValue(true); 

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.message).toBe("User created successfully!");
    expect(response.body.user).toBeDefined();
    expect(response.body.token).toBeDefined();

    expect(slug).toHaveBeenCalledWith("John Doe");
    expect(HashPassword).toHaveBeenCalledWith(userData.password);
    expect(User.create).toHaveBeenCalledWith({
      ...userData,
      password: "hashed_password",
      role: "client",
      slug: "john-doe",
    });

    expect(CreateToken).toHaveBeenCalledWith({ id: "user_id" }, "5m");
    expect(envoyerEmail).toHaveBeenCalledWith(
      "john.doe@example.com",
      "verfei accoute",
      "http://localhost:8001/api/auth/verifyAcount/mocked_token",
      null,
      "OTP"
    );
  });

  it("should return an error if registration fails", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
      confirmPassword: "securepassword",
      phone: "123456789",
    };

    User.create.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(400);

    expect(response.body.message).toBe("An error occurred during registration");
    expect(response.body.error).toBe("Database error");
  });
});
