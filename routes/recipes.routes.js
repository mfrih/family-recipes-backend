const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe.model");
const isAuthenticated = require("../config/isAuthenticated");

// ALL ROUTES ARE PREFIXED BY /api/recipes //

// * POST add recipe by a user (to 0 --> n families)
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
    if (!name || !servings || !ingredients || !instructions) {
      return res.status(400).json({
        message:
          "Name, servings, ingredients and instructions are mandatory fields",
      });
    }

    // checks if the recipe name already exists within the family's recipes

    const existingRecipe = await Recipe.findOne({
      name: name,
      familyId: { $in: familyId },
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

// * GET all recipes I created
router.get("/my-recipes", isAuthenticated, async (req, res, next) => {
  try {
    const allMyRecipes = await Recipe.find({
      creatorId: { $in: req.user._id },
    });
    res.status(200).json(allMyRecipes);
  } catch (error) {
    next(error);
  }
});

// * PUT modify recipe (by its creator)
router.put("/:recipeId", isAuthenticated, async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const {
      name,
      servings,
      ingredients,
      instructions,
      isSignatureRecipe,
      isSecret,
    } = req.body;

    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: recipeId, creatorId: req.user._id },
      {
        name,
        servings,
        ingredients,
        instructions,
        isSignatureRecipe,
        isSecret,
      },
      { new: true }
    );
    if (!updatedRecipe) {
      return res.status(400).json({ message: "Invalid request" });
    }
    return res.status(202).json(updatedRecipe);
  } catch (error) {
    next(error);
  }
});

// * DELETE recipe (by its creator)
router.delete("/:recipeId", isAuthenticated, async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    await Recipe.findOneAndDelete({
      _id: recipeId,
      creatorId: req.user._id,
    });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
