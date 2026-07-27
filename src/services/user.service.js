import User from "../models/User.js";

const userAttributes = {
  exclude: ["password"],
};

export const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: userAttributes,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateProfile = async (userId, data) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await user.update({
    firstName: data.firstName ?? user.firstName,
    lastName: data.lastName ?? user.lastName,
  });

  return await User.findByPk(userId, {
    attributes: userAttributes,
  });
};

export const uploadProfilePicture = async (userId, file) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.avatar = file.path;
  user.avatarPublicId = file.filename;

  await user.save();

  return await User.findByPk(userId, {
    attributes: userAttributes,
  });
};
