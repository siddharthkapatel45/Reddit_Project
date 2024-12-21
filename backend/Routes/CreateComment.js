import express from 'express';
import authenticateJWT from '../Authentication/Auth.js';
import Signup from '../models/Signup.js';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

const router = express.Router();

// Create Comment API
router.post('/create', authenticateJWT, async (req, res) => {
  try {
    // Get the user making the request
    const person = await Signup.findOne({ username: req.user.username });
    if (!person) {
      return res.status(404).json({ message: "User not found" });
    }

    const { content, pid, parentComment } = req.body;

    // Validate post existence
    const post = await Post.findById(pid);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Validate parent comment existence if provided
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
    }

    // Create the comment
    const comment = new Comment({
      content,
      author: person._id,
      post: pid,
      parentComment: parentComment || null, // Set parentComment or default to null
    });

    await comment.save();

    // Optionally, you can update the post to include the comment ID
    post.comments.push(comment._id);
    await post.save();

    res.status(200).json({ message: "Comment added successfully", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
router.get('/allcomment',authenticateJWT,async(req,res)=>{
  const uname=req.user.username;
  const Person= await Signup.findOne({username:uname});
  const allComment=await Comment.find({author:Person._id});
  res.send(allComment);
})
router.get('/:postId', authenticateJWT, async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate post existence
    const post = await Post.findById(postId).populate('comments');
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Fetch all comments for the post
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username')
      .populate('parentComment')
      .exec();

    res.status(200).json({ comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
