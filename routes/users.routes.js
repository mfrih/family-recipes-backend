const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Family = require("../models/Family.model");

// ! ALL ROUTES ARE PREFIXED BY /api/users

// GET all users
router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
