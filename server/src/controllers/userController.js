import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const userId = res.locals.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      success: true,
      name: user.name,
      isAccountVerified: user.isAccountVerified,
    });
  } catch (error) {
    console.error("Error in getUserData:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
