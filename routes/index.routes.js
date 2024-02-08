const express = require("express");
const router = express.Router();
const authRouter = require("./auth.routes");
const userRouter = require("./users.routes");
const familyRouter = require("./families.routes");
const recipeRouter = require("./recipes.routes");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRouter);
router.use("/api/users", userRouter);
router.use("/api/families", familyRouter);
router.use("/api/recipes", recipeRouter);

module.exports = router;
