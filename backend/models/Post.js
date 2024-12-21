import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Signup',
    required: true
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  imgUrl: {
    type: String,
    default: "/default-post-image.jpg", // Provide a default image if none is provided
   
  },
  topics: {
    type: [String], // Array of topics (e.g., categories, tags)
    default: []
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },

});

export default mongoose.model('Post', postSchema);
