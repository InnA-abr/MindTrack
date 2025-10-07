import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthdate: { type: String },
    gender: { type: String },
    avatarUrl: { type: String },
    isAdmin: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    awards: [{ type: Schema.Types.ObjectId, ref: "awards" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "users" }],
    followedBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
    date: { type: Date, default: Date.now },
  },
  { strict: false }
);

// 🔐 Автоматичне хешування пароля перед збереженням
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Порівняння пароля
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("users", UserSchema);
export default User;
