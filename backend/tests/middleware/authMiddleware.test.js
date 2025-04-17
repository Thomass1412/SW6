const { verifyToken } = require("../../middlewares/authMiddleware");
const admin = require("../../config/firebase");

jest.mock("../../config/firebase", () => ({
  auth: () => ({
    verifyIdToken: jest.fn(),
  }),
}));

describe("verifyToken middleware", () => {
  const mockNext = jest.fn();
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    mockNext.mockClear();
    mockRes.status.mockClear();
    mockRes.json.mockClear();
  });

  it("should call next if token is valid", async () => {
    const mockDecodedToken = { uid: "123", email: "test@example.com" };
    const mockVerify = jest.fn().mockResolvedValue(mockDecodedToken);
    jest.mock("../../config/firebase", () => ({
        auth: () => ({
          verifyIdToken: mockVerify,
        }),
    }));

    admin.auth().verifyIdToken.mockResolvedValue(mockDecodedToken);

    const req = {
      headers: {
        authorization: "Bearer mockToken",
      },
    };

    await verifyToken(req, mockRes, mockNext);

    expect(admin.auth().verifyIdToken).toHaveBeenCalledWith("mockToken");
    expect(req.user).toEqual(mockDecodedToken);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 403 if no token is provided", async () => {
    const req = { headers: {} };

    await verifyToken(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", async () => {
    const req = {
      headers: {
        authorization: "Bearer badToken",
      },
    };
    admin.auth().verifyIdToken.mockRejectedValue(new Error("Invalid token"));

    await verifyToken(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
