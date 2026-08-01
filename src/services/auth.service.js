import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import PasswordReset from "../models/PasswordReset.js";
import { ROLES } from "../constants/roles.js";
import { sendPasswordResetEmail } from "./email.service.js";

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const registerUser = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role = ROLES.VOLUNTEER,
  } = userData;

  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  return {
    user,
    token,
  };
};

export const forgotPassword = async ({ email }) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(token);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await PasswordReset.create({
    userId: user.id,
    tokenHash,
    expiresAt,
    used: false,
  });

  await sendPasswordResetEmail({
    email: user.email,
    firstName: user.firstName,
    token,
  });

  return {
    emailSent: true,
  };
};

export const resetPassword = async ({ token, password }) => {
  const tokenHash = hashResetToken(token);

  const reset = await PasswordReset.findOne({
    where: {
      tokenHash,
      used: false,
    },
  });

  if (!reset) {
    throw new Error("Invalid token");
  }

  if (new Date() > reset.expiresAt) {
    throw new Error("Token expired");
  }

  const user = await User.findByPk(reset.userId);

  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  user.password = hashedPassword;
  await user.save();

  reset.used = true;
  await reset.save();
};
