import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: "No description provided",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Signup',
    required: true,
  },
  members: { type: [String], default: [] }, 
  imgUrl: {
    type: String, // Path to the uploaded image
    default: "/default-community-image.jpg", // Placeholder/default image
  },
  topics: {
    type: [String], // Array of strings
    default: [], // Default to an empty array if no topics are provided
    validate: {
      validator: function (arr) {
        return arr.length <= 10; // Optional: limit the number of topics
      },
      message: "A community can have up to 10 topics.",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.model('Community', communitySchema);
