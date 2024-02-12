const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Family = require("../models/Family.model");

// ! ALL ROUTES ARE PREFIXED BY /api/users

// GET all users with a search filter on username and email
router.get("/", async (req, res, next) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { username: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
        ],
      };
    }
    const allUsers = await User.find(filter);
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
