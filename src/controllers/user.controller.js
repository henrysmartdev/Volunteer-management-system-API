import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
} from "../services/user.service.js";

export const getProfileController = async (req, res) => {
  const user = await getProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};

export const updateProfileController = async (req, res) => {
  const user = await updateProfile(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
};

export const uploadProfilePictureController = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image",
    });
  }

  const user = await uploadProfilePicture(req.user.id, req.file);

  res.status(200).json({
    success: true,
    message: "Profile picture uploaded successfully",
    data: user,
  });
};
