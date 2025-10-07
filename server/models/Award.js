import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AwardSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    posts: [
      {
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    date: { type: Date, default: Date.now },
  },

  { versionKey: false }
);

const Award = model("Award", AwardSchema);

export default Award;
