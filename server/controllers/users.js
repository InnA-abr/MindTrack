import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import _ from "lodash";
import keys from "../config/keys.js";
import getConfigs from "../config/getConfigs.js";
import uniqueRandom from "unique-random";

import User from "../models/User.js";
import Award from "../models/Award.js";
import Post from "../models/Post.js";

import validateRegistrationForm from "../validation/validationHelper.js";
import queryCreator from "../commonHelpers/queryCreator.js";
import filterParser from "../commonHelpers/filterParser.js";

const rand = uniqueRandom(10000000, 99999999);

// Register new user
export const createUser = async (req, res) => {
  const initialQuery = _.cloneDeep(req.body);
  const { errors, isValid } = validateRegistrationForm(req.body);

  if (!isValid) return res.status(400).json(errors);

  try {
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { login: req.body.login }],
    });

    if (existingUser) {
      if (existingUser.email === req.body.email) {
        return res
          .status(400)
          .json({ message: `Email ${req.body.email} already exists` });
      }
      if (existingUser.login === req.body.login) {
        return res
          .status(400)
          .json({ message: `Login ${req.body.login} already exists` });
      }
    }

    const newUser = new User(queryCreator(initialQuery));
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    const savedUser = await newUser.save();
    return res.json(savedUser);
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err}` });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { errors, isValid } = validateRegistrationForm(req.body);
  if (!isValid) return res.status(400).json(errors);

  const { loginOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });

    if (!user) {
      errors.loginOrEmail = "User not found";
      return res.status(404).json(errors);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errors.password = "Password incorrect";
      return res.status(400).json(errors);
    }

    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 36000 });

    return res.json({ success: true, token: "Bearer " + token });
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err}` });
  }
};

// Edit personal info
export const editUserInfo = async (req, res) => {
  const initialQuery = _.cloneDeep(req.body);
  const { errors, isValid } = validateRegistrationForm(req.body);
  if (!isValid) return res.status(400).json(errors);

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { email, login } = req.body;

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists)
        return res
          .status(400)
          .json({ message: `Email ${email} already exists` });
    }

    if (login && login !== user.login) {
      const loginExists = await User.findOne({ login });
      if (loginExists)
        return res
          .status(400)
          .json({ message: `Login ${login} already exists` });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: queryCreator(initialQuery) },
      { new: true }
    );

    return res.json(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err}` });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  const { errors, isValid } = validateRegistrationForm(req.body);
  if (!isValid) return res.status(400).json(errors);

  const { password: oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    return res.json({
      message: "Password successfully changed",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err}` });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-login -password")

      .populate("followedBy", "firstName lastName email avatarUrl")
      .populate("followers", "firstName lastName email avatarUrl");

    if (!user) return res.status(404).json({ message: `User not found` });

    return res.json(user);
  } catch (err) {
    console.log("getUserById error: ", err);
    return res.status(500).json({ message: `Server error: ${err}` });
  }
};

// Award Management
export const addAwardToUser = async (req, res) => {
  try {
    const award = await Award.findById(req.params.awardId);
    if (!award) return res.status(404).json({ message: "Award not found" });

    const user = await User.findById(req.user.id);
    if (user.awards.includes(req.params.awardId)) {
      return res.status(400).json({ message: "Award already exists for user" });
    }

    user.awards.push(req.params.awardId);
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: queryCreator(user) },
      { new: true }
    )
      .populate("awards")
      .populate("followedBy", "firstName lastName email avatarUrl")
      .populate("followers", "firstName lastName email avatarUrl");

    return res.json(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err}` });
  }
};

export const deleteAwardFromUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.awards.includes(req.params.awardId)) {
      return res.status(400).json({ message: "Award not found in user list" });
    }

    user.awards = user.awards.filter(
      (id) => id.toString() !== req.params.awardId
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: queryCreator(user) },
      { new: true }
    )
      .populate("awards")
      .populate("followedBy", "firstName lastName email avatarUrl")
      .populate("followers", "firstName lastName email avatarUrl");

    return res.json(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err}` });
  }
};

// Followers
export const addUserToFollowers = async (req, res) => {
  console.log("User", req.user.id, "tries to follow", req.params.userId);
  if (req.user.id === req.params.userId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    const userToAdd = await User.findById(req.params.userId);
    const user = await User.findById(req.user.id);

    if (!userToAdd || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.followers.includes(req.params.userId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    userToAdd.followedBy.push(req.user.id);
    user.followers.push(req.params.userId);

    await userToAdd.save();
    const updatedUser = await user.save();

    const populated = await User.findById(updatedUser.id)
      .populate("awards")
      .populate("followedBy", "firstName lastName email avatarUrl")
      .populate("followers", "firstName lastName email avatarUrl");

    return res.json(populated);
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err}` });
  }
};

export const deleteUserFromFollowers = async (req, res) => {
  try {
    const userToRemove = await User.findById(req.params.userId);
    const user = await User.findById(req.user.id);

    if (!userToRemove || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.followers.includes(req.params.userId)) {
      return res
        .status(400)
        .json({ message: "User is not in your followers list" });
    }

    userToRemove.followedBy = userToRemove.followedBy.filter(
      (id) => id.toString() !== req.user.id
    );
    user.followers = user.followers.filter(
      (id) => id.toString() !== req.params.userId
    );

    await userToRemove.save();
    const updatedUser = await user.save();

    const populated = await User.findById(updatedUser.id)
      .populate("awards")
      .populate("followedBy", "firstName lastName email avatarUrl")
      .populate("followers", "firstName lastName email avatarUrl");

    return res.json(populated);
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err}` });
  }
};

// Filtered user list
export const getUsersFilterParams = async (req, res) => {
  const query = filterParser(req.query);
  const perPage = Number(req.query.perPage) || 10;
  const startPage = Number(req.query.startPage) || 1;
  const sort = req.query.sort || "date";

  try {
    const users = await User.find(query)
      .select("-login -password -isAdmin")
      .skip((startPage - 1) * perPage)
      .limit(perPage)
      .sort(sort);

    const total = await User.countDocuments(query);

    return res.json({ users, usersQuantity: total });
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err}` });
  }
};
