import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Only for email login
    role: {
      type: String,
      enum: ["candidate", "admin"],
      default: "candidate"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
