const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    //0 - Misc Admin ; 1 - Category Admins
    type: {
      default: 0,
      enum: [0, 1],
      type: Number,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    email: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    // Only for Category type
    //   events: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Event",
    //     },
    //   ],
  },
  { timestamps: true }
);
module.exports = Admin = mongoose.model("Admin", adminSchema);
