const { checkAdmin } = require("../../middlewares/roleMiddleware");
const User = require("../../models/user");

jest.mock("../../models/user");

describe("checkAdmin middleware", () => {
  const mockNext = jest.fn();
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should proceed if user is admin", async () => {
    const req = {
      user: { email: "admin@example.com" },
    };

    const user = { email: "admin@example.com", role: "Admin" };

    User.findOne.mockResolvedValue(user);

    await checkAdmin(req, mockRes, mockNext);

    expect(req.user).toBe(user);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 401 if no req.user", async () => {
    const req = {}; // no user

    await checkAdmin(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid Firebase Token" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", async () => {
    const req = {
      user: { email: "user@example.com" },
    };

    User.findOne.mockResolvedValue({ email: "user@example.com", role: "User" });

    await checkAdmin(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Forbidden - Admins only" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if user lookup fails", async () => {
    const req = {
      user: { email: "whoops@example.com" },
    };

    User.findOne.mockRejectedValue(new Error("DB error"));

    await checkAdmin(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid Firebase Token" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
