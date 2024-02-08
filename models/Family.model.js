const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const familySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Family name is required."],
    },
    creatorId: {
      type: ObjectId,
      required: [true, "Creator ID is required."],
      ref: "User",
    },
    members: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    admins: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Family = model("Family", familySchema);

module.exports = Family;
