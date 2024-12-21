import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000, // Limit the content length to 1000 characters
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Signup', // Reference to the User schema
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Reference to the Post schema
    required: true,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment', // Optional reference to another comment for nested replies
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default  mongoose.model('Comment', commentSchema);
