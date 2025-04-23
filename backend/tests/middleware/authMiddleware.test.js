const { verifyToken } = require("../../middlewares/authMiddleware");

const mockVerifyIdToken = jest.fn();

// Mock the Firebase admin SDK
jest.mock("../../config/firebase", () => ({
  auth: () => ({
    verifyIdToken: mockVerifyIdToken,
  }),
}));

describe("verifyToken middleware", () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next if token is valid", async () => {
    const mockDecodedToken = { uid: "123abc", email: "test@example.com" };
    mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

    const req = {
      headers: {
        authorization: "Bearer valid-token",
      },
    };

    await verifyToken(req, mockRes, mockNext);

    expect(mockVerifyIdToken).toHaveBeenCalledWith("valid-token");
    expect(req.user).toEqual(mockDecodedToken);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 403 if no token is provided", async () => {
    const req = {
      headers: {},
    };

    await verifyToken(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", async () => {
    mockVerifyIdToken.mockRejectedValue(new Error("Invalid token"));

    const req = {
      headers: {
        authorization: "Bearer invalid-token",
      },
    };

    await verifyToken(req, mockRes, mockNext);

    expect(mockVerifyIdToken).toHaveBeenCalledWith("invalid-token");
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
