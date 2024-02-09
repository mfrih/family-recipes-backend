const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe.model");
const isAuthenticated = require("../config/isAuthenticated");

// ! ALL ROUTES ARE PREFIXED BY /api/recipes //

// POST add recipe to your family
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const {
      name,
      servings,
      ingredients,
      instructions,
      isSignatureRecipe,
      isSecret,
      familyId,
    } = req.body;
    const userId = req.user._id;

    //checks if name, servings, ingredients, instructions are empty
    if (!name || !servings || !ingredients || !instructions || !familyId) {
      return res.status(400).json({
        message:
          "Name, servings, ingredients and instructions are mandatory fields",
      });
    }

    // checks if the recipe name already exists within the family's recipes

    const existingRecipe = await Recipe.findOne({
      name: name,
      familyId: familyId,
    });
    if (existingRecipe) {
      return res.status(400).json({
        message: "This recipe already exists within your family's recipes",
      });
    }
    // create recipe
    const createdRecipe = await Recipe.create({
      name,
      creatorId: userId,
      servings,
      ingredients,
      instructions,
      isSignatureRecipe,
      isSecret,
      familyId,
    });
    return res.status(201).json(createdRecipe);
  } catch (error) {
    next(error);
  }
});

// GET all recipes belonging to a specific family

// PUT modify recipe (by its creator)

// DELETE recipe (by its creator)

module.exports = router;
