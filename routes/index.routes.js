const express = require("express");
const router = express.Router();
const authRouter = require("./auth.routes");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRouter);

module.exports = router;
