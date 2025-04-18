const request = require("supertest");
const express = require("express");
const userRoutes = require("../routes/userRoutes");
const User = require("../models/user");

// Mock the middlewares
jest.mock("../middlewares/authMiddleware", () => ({
  verifyToken: (req, res, next) => {
    req.user = { email: "admin@example.com" };
    next();
  },
}));

jest.mock("../middlewares/roleMiddleware", () => ({
  checkAdmin: (req, res, next) => {
    req.user.role = "Admin";
    next();
  },
}));

jest.mock("../models/user");

const app = express();
app.use(express.json());
app.use("/user", userRoutes);

describe("User Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /user/employees", () => {
    it("should return all employees without jobTitle filter", async () => {
      User.find.mockResolvedValue([
        { _id: "1", name: "Alice", role: "User" },
        { _id: "2", name: "Bob", role: "User" },
      ]);

      const res = await request(app).get("/user/employees");

      expect(res.statusCode).toBe(200);
      expect(User.find).toHaveBeenCalledWith({ role: "User" }, "-password");
      expect(res.body.length).toBe(2);
    });

    it("should filter employees by jobTitle", async () => {
      User.find.mockResolvedValue([{ _id: "3", name: "Charlie", jobTitle: "Nurse" }]);

      const res = await request(app).get("/user/employees?jobTitle=Nurse");

      expect(res.statusCode).toBe(200);
      expect(User.find).toHaveBeenCalledWith(
        { role: "User", jobTitle: { $in: ["Nurse"] } },
        "-password"
      );
      expect(res.body[0].name).toBe("Charlie");
    });

    it("should handle server error", async () => {
      User.find.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/user/employees");

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("DB error");
    });
  });

  describe("DELETE /user/delete/:id", () => {
    it("should delete a user by ID", async () => {
      User.findByIdAndDelete.mockResolvedValue({ _id: "123", name: "ToDelete" });

      const res = await request(app).delete("/user/delete/123");

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("User deleted successfully");
      expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");
    });

    it("should return 404 if user not found", async () => {
      User.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete("/user/delete/123");

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });

    it("should handle delete error", async () => {
      User.findByIdAndDelete.mockRejectedValue(new Error("Delete failed"));

      const res = await request(app).delete("/user/delete/123");

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("Delete failed");
    });
  });
});
