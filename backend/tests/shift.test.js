const request = require("supertest");
const express = require("express");
const shiftRoutes = require("../routes/shiftRoutes");
const Shift = require("../models/shift");
const User = require("../models/user");
const { geocode, calculateDistanceMeters } = require("../utils/locationUtils");
const dayjs = require("dayjs"); 

jest.mock("../models/shift");
jest.mock("../models/user");
jest.mock("../utils/locationUtils", () => ({
  geocode: jest.fn(),
  calculateDistanceMeters: jest.fn(),
}));
jest.mock("../middlewares/authMiddleware", () => ({
  verifyToken: (req, res, next) => {
    req.user = { email: "user@example.com", id: "user123" };
    next();
  },
}));
jest.mock("../middlewares/roleMiddleware", () => ({
  checkAdmin: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/shift", shiftRoutes);
describe("POST /shift/create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a shift when data is valid and no overlap", async () => {
    Shift.findOne.mockResolvedValue(null); // no overlapping shift
    Shift.prototype.save = jest.fn().mockResolvedValue(true); // mock save

    const res = await request(app).post("/shift/create").send({
      date: "2025-04-17",
      startTime: "08:00",
      endTime: "16:00",
      employee: "employee123",
      repeat: null
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.length).toBe(1);
    expect(Shift.prototype.save).toHaveBeenCalled();
  });

  it("should return 400 for invalid start time", async () => {
    const res = await request(app).post("/shift/create").send({
      date: "2025-04-17",
      startTime: "invalid",
      endTime: "16:00",
      employee: "employee123"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if overlapping shift exists", async () => {
    Shift.findOne.mockResolvedValue({ _id: "existingShift" });

    const res = await request(app).post("/shift/create").send({
      date: "2025-04-17",
      startTime: "08:00",
      endTime: "16:00",
      employee: "employee123"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "This employee already has a shift that overlaps with the selected time.");
  });

  it("should return 500 if server crashes", async () => {
    Shift.findOne.mockRejectedValue(new Error("DB failure"));

    const res = await request(app).post("/shift/create").send({
      date: "2025-04-17",
      startTime: "08:00",
      endTime: "16:00",
      employee: "employee123"
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "DB failure");
  });
});

describe("Shift Routes", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("POST /shift/new-unavailability - creates unavailability", async () => {
      User.findOne.mockResolvedValue({ _id: "user123" });
      Shift.find.mockResolvedValue([]);
      Shift.prototype.save = jest.fn().mockResolvedValue(true);
  
      const res = await request(app).post("/shift/new-unavailability").send({
        date: "2025-04-20",
        startTime: "09:00",
        endTime: "11:00",
      });
  
      expect(res.statusCode).toBe(201);
      expect(res.body.length).toBeGreaterThan(0);
    });
  
    it("POST /shift/sign-in - allows valid sign-in", async () => {
      Shift.findById.mockResolvedValue({
        _id: "shift1",
        date: "2025-04-20",
        startTime: "08:00",
        endTime: "16:00",
        status: "scheduled",
        location: "Somewhere",
        save: jest.fn().mockResolvedValue(true),
      });
    
      geocode.mockResolvedValue({ lat: 55.6761, lng: 12.5683 });
      calculateDistanceMeters.mockReturnValue(50);
    
      const timestamp = dayjs("2025-04-20T07:55:00").toISOString(); // 5 mins before start
    
      const res = await request(app).post("/shift/sign-in").send({
        shiftId: "shift1",
        location: { latitude: 55.6761, longitude: 12.5683 },
        timestamp,
      });
    
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Successfully signed in");
    });
  
    it("GET /shift/my-shifts - returns user shifts", async () => {
      User.findOne.mockResolvedValue({ _id: "user123" });
      Shift.find.mockResolvedValue([{ _id: "s1", startTime: "08:00" }]);
  
      const res = await request(app).get("/shift/my-shifts?date=2025-04-20");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  
    it("DELETE /shift/delete/:id - deletes shift", async () => {
      Shift.findByIdAndDelete.mockResolvedValue({ _id: "shift1" });
  
      const res = await request(app).delete("/shift/delete/shift1");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Shift deleted successfully");
    });
  });
  
