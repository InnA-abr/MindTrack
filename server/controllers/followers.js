import User from "../models/User.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Отримати список підписників
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ message: "Некоректний ідентифікатор користувача." });
    }

    const user = await User.findById(userId).populate(
      "followedBy",
      "firstName lastName username avatarUrl"
    );

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено." });
    }

    const followers = await Promise.all(
      user.followedBy.map(async (f) => {
        const currentUser = await User.findById(currentUserId);
        const isFollowing = currentUser.followers.includes(f._id);

        return {
          id: f._id,
          username: f.username || f.email || f.login,
          firstName: f.firstName,
          lastName: f.lastName,
          avatarUrl: f.avatarUrl,
          following: isFollowing,
        };
      })
    );

    res.json(followers);
  } catch (err) {
    console.error("Помилка при отриманні підписників:", err);
    res.status(500).json({ message: "Внутрішня помилка сервера." });
  }
};

// Отримати список тих, на кого підписаний користувач
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ message: "Некоректний ідентифікатор користувача." });
    }

    const user = await User.findById(userId).populate(
      "followers",
      "firstName lastName username avatarUrl"
    );

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено." });
    }

    const following = user.followers.map((f) => ({
      id: f._id,
      username: f.username || f.email || f.login,
      firstName: f.firstName,
      lastName: f.lastName,
      avatarUrl: f.avatarUrl,
    }));

    res.json(following);
  } catch (err) {
    console.error("Помилка при отриманні підписок:", err);
    res.status(500).json({ message: "Внутрішня помилка сервера." });
  }
};

// Підписатися на користувача
export const followUser = async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.user.id;

    if (!isValidObjectId(targetUserId)) {
      return res
        .status(400)
        .json({ message: "Некоректний ідентифікатор користувача." });
    }

    if (targetUserId === currentUserId) {
      return res
        .status(400)
        .json({ message: "Ви не можете підписатися на себе." });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "Користувача не знайдено." });
    }

    if (!currentUser.followers.includes(targetUserId)) {
      currentUser.followers.push(targetUserId);
    }

    if (!targetUser.followedBy.includes(currentUserId)) {
      targetUser.followedBy.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({ success: true, message: "Ви підписалися на користувача." });
  } catch (err) {
    console.error("Помилка при підписці:", err);
    res.status(500).json({ message: "Внутрішня помилка сервера." });
  }
};

// Відписатися від користувача
export const unfollowUser = async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    console.log("targetUserId: ", targetUserId);

    const currentUserId = req.user.id;

    if (!isValidObjectId(targetUserId)) {
      return res
        .status(400)
        .json({ message: "Некоректний ідентифікатор користувача." });
    }

    if (targetUserId === currentUserId) {
      return res
        .status(400)
        .json({ message: "Ви не можете відписатися від себе." });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "Користувача не знайдено." });
    }

    currentUser.followers = currentUser.followers.filter(
      (id) => id.toString() !== targetUserId
    );

    targetUser.followedBy = targetUser.followedBy.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    res.json({ success: true, message: "Ви відписалися від користувача." });
  } catch (err) {
    console.error("Помилка при відписці:", err);
    res.status(500).json({ message: "Внутрішня помилка сервера." });
  }
};
