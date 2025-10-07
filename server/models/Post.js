import mongoose from "mongoose";

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    content: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
      default: true,
    },
    likes: {
      type: [String],
      default: [],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false, timestamps: true }
);

const Post = mongoose.model("posts", PostSchema);

export default Post;
