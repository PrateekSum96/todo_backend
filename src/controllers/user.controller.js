import { User } from "../models/users.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const options = {
  httpOnly: true,
  secure: true,
};

const signup = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    throw new ApiError(400, "All fields are required.");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(409, "email or username already exists.");
  }

  const user = await User.create({
    email,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user.");
  }

  const token = await createdUser.generateToken();

  return res
    .status(201)
    .cookie("authToken", token, options)
    .json(
      new ApiResponse(
        200,
        { user: createdUser, authToken: token },
        "User signup successfully"
      )
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "email or password missing");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials.");
  }
  const token = await user.generateToken();
  const loggedInUser = await User.findById(user._id).select("-password");
  return res
    .status(200)
    .cookie("authToken", token, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, authToken: token },
        "User logged In Successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("authToken", options)
    .json(new ApiResponse(200, {}, "user logged Out Successfully"));
});
export { signup, login, logout };
