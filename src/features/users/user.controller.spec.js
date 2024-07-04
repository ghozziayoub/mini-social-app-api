const userController = require("./users.controller");
const userService = require("./users.service");
const { AppError } = require("../../middleware/errorHandler");

jest.mock("./users.service");

let req, res, next;

beforeEach(() => {
  req = { body: {}, params: {}, query: {} };
  res = {
    json: jest.fn(),
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };
  next = jest.fn();
});

describe("User Controller", () => {
  describe("signup", () => {
    it("should create a new user and return 201 status", async () => {
      const mockUserData = {
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      const mockUserResponse = { message: "User signed up successfully." };
      userService.signup.mockResolvedValue(mockUserResponse);

      req.body = mockUserData;
      await userController.signup(req, res, next);

      expect(userService.signup).toHaveBeenCalledWith(mockUserData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining(mockUserResponse)
      );
    });

    it("should call next with an error if user already exists", async () => {
      const mockUserData = {
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      userService.signup.mockRejectedValue(
        new AppError("User already exists.", 400)
      );

      req.body = mockUserData;
      await userController.signup(req, res, next);

      expect(userService.signup).toHaveBeenCalledWith(mockUserData);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("login", () => {
    it("should sign in an existing user and return 200 status", async () => {
      const mockUserData = {
        email: "john@example.com",
        password: "password123",
      };
      const mockToken = "mockToken";

      userService.login.mockResolvedValue(mockToken);

      req.body = mockUserData;
      await userController.login(req, res, next);

      expect(userService.login).toHaveBeenCalledWith(mockUserData);
      expect(res.setHeader).toHaveBeenCalledWith(
        "Access-Control-Expose-Headers",
        "X-Token"
      );
      expect(res.setHeader).toHaveBeenCalledWith("X-Token", mockToken);
      expect(res.json).toHaveBeenCalledWith({
        message: "User logged in successfully.",
      });
    });

    it("should call next with an error if login fails", async () => {
      const mockUserData = {
        email: "john@example.com",
        password: "wrongpassword",
      };

      userService.login.mockRejectedValue(
        new AppError("Invalid email or password.", 401)
      );

      req.body = mockUserData;
      await userController.login(req, res, next);

      expect(userService.login).toHaveBeenCalledWith(mockUserData);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });
  });
});
