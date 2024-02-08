const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Recipe name is required."],
    },
    servings: {
      type: Number,
      required: [true, "Number of servings is required."],
    },
    ingredients: {
      type: String,
      required: [true, "Ingredients are required."],
    },
    instructions: {
      type: String,
      required: [true, "Instructions are required."],
    },
    creatorId: {
      type: ObjectId,
      required: [true, "Creator ID is required."],
      ref: "User",
    },
    familyId: {
      type: ObjectId,
      ref: "Family",
    },
    isSignatureRecipe: {
      type: Boolean,
      default: false,
    },
    isSecret: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
