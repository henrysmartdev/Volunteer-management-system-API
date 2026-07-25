import { registerUser, loginUser } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const buildUserResponse = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
});

export const register = async (req, res) => {
  const user = await registerUser(req.body);

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: {
      user: buildUserResponse(user),
      token,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: buildUserResponse(user),
      token,
    },
  });
};
