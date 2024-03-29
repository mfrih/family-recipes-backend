const express = require("express");
const router = express.Router();
const Family = require("../models/Family.model");
const Recipe = require("../models/Recipe.model");
const isAuthenticated = require("../config/isAuthenticated");
// ? const { updateSearchIndex } = require("../models/User.model"); Pourquoi ce truc a-t-il été rajouté automatiquement ?

// ! ALL ROUTES ARE PREFIXED BY /api/families

//* GET all families where a user is a member

router.get("/my-families", isAuthenticated, async (req, res, next) => {
  try {
    const allFamilies = await Family.find({ members: { $in: [req.user._id] } });
    res.status(200).json(allFamilies);
  } catch (error) {
    next(error);
  }
});

//* GET one family by its Id

router.get("/:familyId", isAuthenticated, async (req, res, next) => {
  try {
    const { familyId } = req.params;
    const family = await Family.findById(familyId);
    res.status(200).json(family);
    if (!family) {
      return res.status(404).json({ message: "Couldn't find family" });
    }
  } catch (error) {
    next(error);
  }
});

//* GET one family and populate it with its members

router.get("/:familyId/members", isAuthenticated, async (req, res, next) => {
  try {
    const { familyId } = req.params;
    const searchedFamily = await Family.findById(familyId).populate("members");
    if (!searchedFamily) {
      return res.status(404).json({ message: "Couldn't find family" });
    }
    res.status(200).json(searchedFamily.members);
  } catch (error) {
    next(error);
  }
});

//* POST to create a family

router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user._id;
    // console.log(`-----------------req.user-------- ${req.user}`);

    //check if name is empty
    if (!name) {
      return res.status(400).json({ message: "The name field is mandatory" });
    }

    // checks if the name already exists within the families the user is a member of

    const existingFamily = await Family.findOne({
      name: name,
      members: { $in: [req.user._id] },
    });
    if (existingFamily) {
      return res
        .status(400)
        .json({ message: "This family name already exists" });
    }

    // create family
    const createdFamily = await Family.create({
      name,
      creatorId: userId,
      members: [userId],
      admins: [userId],
      avatar,
    });
    return res.status(201).json(createdFamily);
  } catch (error) {
    next(error);
  }
});

//* PUT to add members to a family

router.put(
  "/:familyId/members/add",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { familyId } = req.params;

      //get the userId to be added from the req.body we're sending
      const { addedUserId } = req.body;

      // checks if userId is empty
      if (!addedUserId) {
        return res
          .status(400)
          .json({ message: "there is no user to add to the family" });
      }

      //add userIds to the family's members array
      // finds the family to update and checks if the authenticated user is an admin of the family
      // pushes the added user to the members array
      const updatedfamily = await Family.findOneAndUpdate(
        { _id: familyId, admins: { $in: [req.user._id] } },
        { $addToSet: { members: addedUserId } },
        { new: true }
      );

      if (!updatedfamily) {
        return res.status(400).json({ message: "Invalid request" });
      }

      return res.status(202).json(updatedfamily);
    } catch (error) {
      next(error);
    }
  }
);

//* PUT to remove members from a family

router.put(
  "/:familyId/members/remove",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { familyId } = req.params;
      //get the userId to be removed from the req.body we're sending
      const { removedUserId } = req.body;
      // checks if userId is empty
      if (!removedUserId) {
        return res
          .status(400)
          .json({ message: "there is no user to remove from the family" });
      }
      const updatedfamily = await Family.findOneAndUpdate(
        { _id: familyId, admins: { $in: [req.user._id] } },
        { $pull: { members: removedUserId } },
        { new: true }
      );

      if (!updatedfamily) {
        return res.status(400).json({ message: "Invalid request" });
      }

      return res.status(202).json(updatedfamily);
    } catch (error) {
      error(next);
    }
  }
);

//* GET all recipes belonging to a specific family

router.get("/:familyId/recipes", isAuthenticated, async (req, res, next) => {
  try {
    const { familyId } = req.params;
    const allRecipes = await Recipe.find({ familyId: familyId }).populate(
      "creatorId"
    );
    if (!allRecipes) {
      return res.status(404).json({ message: "Couldn't find any recipes" });
    }
    res.status(200).json(allRecipes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
