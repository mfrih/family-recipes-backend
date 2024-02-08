const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// middleware to verify JWT token
async function isAuthenticated(req, res, next) {
  try {
    // checks if there is an Authorisation header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    //extracts the JWT token by removing the Bearer prefix
    const token = authHeader.replace("Bearer ", "");

    // verifies the JWT token, if the token is valid, it returns the payload
    const payload = jwt.verify(token, process.env.TOKEN_SECRET, {
      algorithms: ["HS256"],
    });

    // find the corresponding user in the DB
    const authenticatedUser = await User.findById(payload._id);
    if (!authenticatedUser) {
      return res.status(401).json({ message: "Denied!" });
    }

    // attaches the user object to the request (req.user)
    req.user = authenticatedUser;

    // calls next to pass control to the next middleware or route handler
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = isAuthenticated;
