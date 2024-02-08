const express = require("express");
const router = express.Router();
const Family = require("../models/Family.model");

// ! ALL ROUTES ARE PREFIXED BY /api/families

//GET all families where a user is a creator or a member

// GET one family and populate it with its members

router.get("/:familyId/users", async (req, res, next) => {
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

// POST to create a family

// router.post("/", async (req, res, next) => {
//   try {
//     const { name, members, avatar } = req.body;
//     //check if name is empty
//     if (!name) {
//       return res.status(400).json({ message: "The name field is mandatory" });
//     }
// checks if the name already exists
// const existingFamily = await Family.findOne({name : name})
// if (existingFamily) {
//     return res.status(400).json({message: "This family name already exists"})
// }
//     const createdFamily = await Family.create({
//       name,
//       members,
//       avatar,
//     });
//     return res.status(201).json(createdFamily);
//   } catch (error) {
//     next(error);
//   }
// });

// PUT to add users to a family

// PUT to delete users from a family

module.exports = router;
