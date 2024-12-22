import express from 'express';
import mongoose from 'mongoose';
import authenticateJWT from '../Authentication/Auth.js';
import Signup from '../models/Signup.js';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

const router = express.Router();

// Create Comment API
router.post('/create', authenticateJWT, async (req, res) => {
  try {
    const { content, pid, parentComment } = req.body;

    // Validate required fields
    if (!content || !pid) {
      return res.status(400).json({ 
        success: false, 
        message: "Content and post ID are required" 
      });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid post ID format" 
      });
    }

    if (parentComment && !mongoose.Types.ObjectId.isValid(parentComment)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid parent comment ID format" 
      });
    }

    // Get user details
    const person = await Signup.findOne({ username: req.user.username });
    if (!person) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Verify post exists
    const post = await Post.findById(pid);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "Post not found" 
      });
    }

    // Verify parent comment if provided
    if (parentComment) {
      const parentCommentDoc = await Comment.findById(parentComment);
      if (!parentCommentDoc) {
        return res.status(404).json({ 
          success: false, 
          message: "Parent comment not found" 
        });
      }
    }

    // Create comment
    const newComment = new Comment({
      content: content.trim(),
      author: person._id,
      post: pid,
      parentComment: parentComment || null
    });

    // Save comment
    const savedComment = await newComment.save();

    // Update post's comments array
    await Post.findByIdAndUpdate(
      pid,
      { $push: { comments: savedComment._id } },
      { new: true }
    );

    // Return populated comment
    const populatedComment = await Comment.findById(savedComment._id)
      .populate('author', 'username imgUrl')
      .populate('parentComment');

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: populatedComment
    });

  } catch (error) {
    console.error('Create comment error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: error.message
    });
  }
});

// Get all comments for a user
router.get('/allcomment', authenticateJWT, async (req, res) => {
  try {
    // Find user
    const person = await Signup.findOne({ username: req.user.username });
    if (!person) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Get comments with populated references
    const comments = await Comment.find({ author: person._id })
      .populate('author', 'username imgUrl')
      .populate('post', 'title')
      .populate('parentComment')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      comments
    });

  } catch (error) {
    console.error('Get all comments error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message
    });
  }
});

// Get comments for a specific post
router.get('/:postId', authenticateJWT, async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Get comments with populated references
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username imgUrl')
      .populate({
        path: 'parentComment',
        populate: {
          path: 'author',
          select: 'username imgUrl'
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      comments
    });

  } catch (error) {
    console.error('Get post comments error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message
    });
  }
});

export default router;