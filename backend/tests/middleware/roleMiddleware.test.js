const { checkAdmin } = require("../../middlewares/roleMiddleware");
const admin = require("../../config/firebase");
const User = require("../../models/user");

jest.mock("../../config/firebase", () => ({
  auth: () => ({
    verifyIdToken: jest.fn(),
  }),
}));

jest.mock("../../models/user", () => ({
  findOne: jest.fn(),
}));

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
      headers: {
        authorization: "Bearer validToken",
      },
    };

    const decodedToken = { email: "admin@example.com" };
    const user = { email: "admin@example.com", role: "Admin" };

    admin.auth().verifyIdToken.mockResolvedValue(decodedToken);
    User.findOne.mockResolvedValue(user);

    await checkAdmin(req, mockRes, mockNext);

    expect(req.user).toBe(user);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 401 if no token", async () => {
    const req = { headers: {} };

    await checkAdmin(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized - No token provided" });
  });

  it("should return 403 if user is not admin", async () => {
    const req = {
      headers: {
        authorization: "Bearer validToken",
      },
    };

    admin.auth().verifyIdToken.mockResolvedValue({ email: "user@example.com" });
    User.findOne.mockResolvedValue({ email: "user@example.com", role: "User" });

    await checkAdmin(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Forbidden - Admins only" });
  });

  it("should return 401 if Firebase verification fails", async () => {
    const req = {
      headers: {
        authorization: "Bearer invalid",
      },
    };

    admin.auth().verifyIdToken.mockRejectedValue(new Error("invalid"));

    await checkAdmin(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid Firebase Token" });
  });
});
