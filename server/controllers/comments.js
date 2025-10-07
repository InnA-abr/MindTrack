import Comment from "../models/Comment.js";
import _ from "lodash";

// Додавання коментаря
export const addComment = async (req, res) => {
  try {
    const commentData = _.cloneDeep(req.body);
    commentData.user = req.user.id;

    const newComment = new Comment(commentData);
    const savedComment = await newComment.save();

    const populatedComment = await savedComment
      .populate("user", "firstName lastName email avatarUrl")
      .execPopulate();

    res.json(populatedComment);
  } catch (err) {
    res.status(400).json({ message: `Error on server: "${err}"` });
  }
};

// Оновлення коментаря
export const updateComment = (req, res) => {
  Comment.findOne({ _id: req.params.id })
    .then((comment) => {
      if (!comment) {
        return res.status(404).json({
          message: `Comment with id "${req.params.id}" not found.`,
        });
      }

      if (!(req.user.isAdmin || req.user.id === comment.user.toString())) {
        return res.status(403).json({
          message: `No permission to update this comment.`,
        });
      }

      const commentData = _.cloneDeep(req.body);

      Comment.findOneAndUpdate(
        { _id: req.params.id },
        { $set: commentData },
        { new: true }
      )
        .populate("user", "firstName lastName email avatarUrl")
        .then((updated) => res.json(updated))
        .catch((err) =>
          res.status(400).json({ message: `Error on server: "${err}"` })
        );
    })
    .catch((err) =>
      res.status(400).json({ message: `Error on server: "${err}"` })
    );
};

// Видалення коментаря
export const deleteComment = (req, res) => {
  Comment.findOne({ _id: req.params.id }).then((comment) => {
    if (!comment) {
      return res.status(404).json({
        message: `Comment with id "${req.params.id}" not found.`,
      });
    }

    if (!(req.user.isAdmin || req.user.id === comment.user.toString())) {
      return res.status(403).json({
        message: `No permission to delete this comment.`,
      });
    }

    Comment.deleteOne({ _id: req.params.id })
      .then(() =>
        res.status(200).json({
          message: `Comment successfully deleted.`,
        })
      )
      .catch((err) =>
        res.status(400).json({ message: `Error on server: "${err}"` })
      );
  });
};

// Отримання всіх коментарів
export const getAllComments = (req, res) => {
  Comment.find()
    .populate("user", "firstName lastName email avatarUrl")
    .then((comments) => res.status(200).json(comments))
    .catch((err) =>
      res.status(400).json({ message: `Error on server: "${err}"` })
    );
};

// Отримання коментарів конкретного користувача
export const getUserComments = (req, res) => {
  Comment.find({ user: req.params.userId })
    .populate("user", "firstName lastName email avatarUrl")
    .then((comments) => res.status(200).json(comments))
    .catch((err) =>
      res.status(400).json({ message: `Error on server: "${err}"` })
    );
};

// Отримання коментарів до поста
export const getPostComments = (req, res) => {
  Comment.find({ post: req.params.postId })
    .populate("user", "firstName lastName email avatarUrl")
    .then((comments) => res.status(200).json(comments))
    .catch((err) =>
      res.status(400).json({ message: `Error on server: "${err}"` })
    );
};
