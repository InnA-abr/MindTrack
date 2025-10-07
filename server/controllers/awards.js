import Award from "../models/Award.js";
import User from "../models/User.js";
import queryCreator from "../commonHelpers/queryCreator.js";
import _ from "lodash";

// Add a new award
export const addAward = (req, res) => {
  const awardData = _.cloneDeep(req.body);
  const newAward = new Award(queryCreator(awardData));

  newAward
    .save()
    .then((award) => res.json(award))
    .catch((err) =>
      res.status(400).json({
        message: `Error happened on server: "${err}" `,
      })
    );
};

// Update an existing award
export const updateAward = (req, res) => {
  Award.findOne({ _id: req.params.id })
    .then((award) => {
      if (!award) {
        return res.status(404).json({
          message: `Award with id "${req.params.id}" is not found.`,
        });
      }

      const awardData = _.cloneDeep(req.body);
      const updatedAward = queryCreator(awardData);

      Award.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updatedAward },
        { new: true }
      )
        .then((award) => res.json(award))
        .catch((err) =>
          res.status(400).json({
            message: `Error happened on server: "${err}" `,
          })
        );
    })
    .catch((err) =>
      res.status(400).json({
        message: `Error happened on server: "${err}" `,
      })
    );
};

// Delete an award
export const deleteAward = (req, res) => {
  Award.findOne({ _id: req.params.id }).then(async (award) => {
    if (!award) {
      return res.status(404).json({
        message: `Award with id "${req.params.id}" is not found.`,
      });
    }

    Award.deleteOne({ _id: req.params.id })
      .then(() =>
        res.status(200).json({
          message: `Award is successfully deleted from DB.`,
        })
      )
      .catch((err) =>
        res.status(400).json({
          message: `Error happened on server: "${err}" `,
        })
      );
  });
};

// Get awards with pagination and sorting
export const getAwards = (req, res) => {
  const perPage = Number(req.query.perPage) || 10;
  const startPage = Number(req.query.startPage) || 1;
  const sort = req.query.sort || "-createdAt";

  Award.find()
    .skip(startPage * perPage - perPage)
    .limit(perPage)
    .sort(sort)
    .then((awards) => res.send(awards))
    .catch((err) =>
      res.status(400).json({
        message: `Error happened on server: "${err}" `,
      })
    );
};

// Get a single award by ID
export const getAwardById = (req, res) => {
  Award.findOne({ _id: req.params.id })
    .then((award) => {
      if (!award) {
        return res.status(404).json({
          message: `Award with id "${req.params.id}" is not found.`,
        });
      }

      res.json(award);
    })
    .catch((err) =>
      res.status(400).json({
        message: `Error happened on server: "${err}" `,
      })
    );
};

export const getAwardByUserId = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  const userAwardsIds = user.awards;

  Award.find({ _id: { $in: userAwardsIds } })
    .then((awards) => res.send(awards))
    .catch((err) =>
      res.status(400).json({
        message: `Error happened on server: "${err}" `,
      })
    );
};
