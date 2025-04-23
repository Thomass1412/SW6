const request = require("supertest");
const express = require("express");
const authRoutes = require("../routes/authRoutes");
const User = require("../models/user");
const admin = require("../config/firebase");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Mock middleware: skip actual auth logic
jest.mock("../middlewares/authMiddleware", () => ({
  verifyToken: (req, res, next) => next(),
}));
jest.mock("../middlewares/roleMiddleware", () => ({
  checkAdmin: (req, res, next) => next(),
}));

// Mocks for dependencies
jest.mock("../models/user");
jest.mock("../config/firebase", () => ({
  auth: () => ({
    createUser: jest.fn(),
    generatePasswordResetLink: jest.fn(),
    verifyIdToken: jest.fn(),
  }),
}));
jest.mock("bcrypt");
jest.mock("nodemailer");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("POST /auth/signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  /*
  it("should create a user and send a reset email", async () => {
    User.findOne.mockResolvedValue(null); // user doesn't exist
    admin.auth().createUser.mockResolvedValue({ uid: "firebaseUID123" });
    bcrypt.hash.mockResolvedValue("hashedPlaceholder");
    User.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
    }));
    admin.auth().generatePasswordResetLink.mockResolvedValue("https://reset-link.com");

    const sendMailMock = jest.fn().mockResolvedValue(true);
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    const res = await request(app).post("/auth/signup").send({
      name: "Test User",
      email: "test@example.com",
      phone: "12345678",
      role: "Admin",
      jobTitle: ["Manager"],
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User created and email sent");
    expect(admin.auth().createUser).toHaveBeenCalled();
    expect(sendMailMock).toHaveBeenCalled();
  }); */

  it("should return 400 if user already exists", async () => {
    User.findOne.mockResolvedValue({ email: "test@example.com" });

    const res = await request(app).post("/auth/signup").send({
      name: "Test User",
      email: "test@example.com",
      phone: "12345678",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "User already exists");
  });

  it("should return 500 on unexpected error", async () => {
    User.findOne.mockRejectedValue(new Error("Unexpected DB error"));

    const res = await request(app).post("/auth/signup").send({
      name: "Test User",
      email: "error@example.com",
      phone: "12345678",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Unexpected DB error");
  });
});
