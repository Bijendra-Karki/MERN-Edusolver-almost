import mongoose from "mongoose";

const { Schema } = mongoose;

const subjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    instructor:{
      type: String,
      required: true,
      trim: true,
    },
     instructorAvatar: {
      type: String,
      default: "/placeholder.svg?height=40&width=40",
    },
    duration: {
      type: String,
      required: true, // e.g., "12 weeks"
    },
   
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  
     level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
     category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // linked with Category model
      required: true,
    },
    image: {
      type: String,
      required: true, // course thumbnail
    },
     description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String, // can be "Free" or "$100"
      required: true,
      default: "Free",
      trim: true,
    },
    subjectFile: {
      type: String, // path or URL of PDF
      required: false,
    },
    
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
  progress: {
      type: Number,
      default: 0,
    },
     difficulty: {
       type: Number,
      default: 0,
     },
    certificates: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: "English",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    estimatedHours: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
