import Post from "../models/Post.js";

import _ from "lodash";
import queryCreator from "../commonHelpers/queryCreator.js";

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const deleted = await Post.findByIdAndDelete(postId);
    if (!deleted) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

export const createPost = async (req, res) => {
  try {
    const postData = _.cloneDeep(req.body);
    postData.user = req.user.id;

    const newPost = new Post(queryCreator(postData));
    const savedPost = await newPost.save();

    const populatedPost = await Post.findById(savedPost._id).populate(
      "user",
      "firstName lastName email avatarUrl"
    );

    res.json(populatedPost);
  } catch (err) {
    res.status(400).json({
      message: `Error happened on server: "${err}"`,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "firstName lastName avatarUrl")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: `Помилка сервера: ${err.message}` });
  }
};

// Оновлення поста
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const updateData = _.cloneDeep(req.body);

    // Перевірка: чи існує пост?
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Перевірка: чи користувач є власником поста?
    // if (post.user.toString() !== req.user.id) {
    //   return res
    //     .status(403)
    //     .json({ message: "You are not authorized to update this post" });
    // }

    // Створюємо оновлений об'єкт за допомогою queryCreator (якщо потрібно)
    const updatedPostData = queryCreator(updateData);

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: updatedPostData },
      { new: true }
    ).populate("user", "firstName lastName email avatarUrl");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

export const getPostsByUserId = async (req, res) => {
  const userId = req.params.userId;

  Post.find({ user: { $in: [userId] } })
    .populate("user", "firstName lastName avatarUrl")
    .then((awards) => res.send(awards))
    .catch((err) =>
      res.status(400).json({
        message: `Error happened on server: "${err}" `,
      })
    );
};
