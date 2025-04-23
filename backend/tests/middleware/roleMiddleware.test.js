const { checkAdmin } = require("../../middlewares/roleMiddleware");
const User = require("../../models/user");

const mockVerifyIdToken = jest.fn();

jest.mock("../../config/firebase", () => ({
  auth: () => ({
    verifyIdToken: mockVerifyIdToken,
  }),
}));

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
      headers: {
        authorization: "Bearer mockToken",
      },
    };

    const decodedToken = { email: "admin@example.com" };
    const user = { email: "admin@example.com", role: "Admin" };

    mockVerifyIdToken.mockResolvedValue(decodedToken);
    User.findOne.mockResolvedValue(user);

    await checkAdmin(req, mockRes, mockNext);

    expect(mockVerifyIdToken).toHaveBeenCalledWith("mockToken");
    expect(req.user).toEqual(user); // FIXED: use toEqual
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 401 if no token provided", async () => {
    const req = {
      headers: {},
    };

    await checkAdmin(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized - No token provided" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", async () => {
    const req = {
      headers: {
        authorization: "Bearer notAdminToken",
      },
    };

    const decodedToken = { email: "user@example.com" };
    const user = { email: "user@example.com", role: "User" };

    mockVerifyIdToken.mockResolvedValue(decodedToken);
    User.findOne.mockResolvedValue(user);

    await checkAdmin(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Forbidden - Admins only" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if Firebase token is invalid", async () => {
    const req = {
      headers: {
        authorization: "Bearer badToken",
      },
    };

    mockVerifyIdToken.mockRejectedValue(new Error("Invalid token"));

    await checkAdmin(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid Firebase Token" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if user lookup throws", async () => {
    const req = {
      headers: {
        authorization: "Bearer validToken",
      },
    };

    const decodedToken = { email: "broken@example.com" };

    mockVerifyIdToken.mockResolvedValue(decodedToken);
    User.findOne.mockRejectedValue(new Error("DB error"));

    await checkAdmin(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid Firebase Token" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
