// models/categoryModel.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true, // e.g. "web-dev"
    },
   
    icon: {
      type: String, // store icon name or path (frontend can map it)
      default: "BookOpen",
    },
    color: {
      type: String,
      default: "bg-blue-500",
    },
    courseCount: {
      type: Number,
      default: 0, // can update dynamically when courses are added
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
