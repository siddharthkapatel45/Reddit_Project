import express from 'express';
import multer from 'multer';
import Fuse from 'fuse.js';
const router = express.Router();
import authenticateJWT from '../Authentication/Auth.js';
import Signup from '../models/Signup.js';
import Post from '../models/Post.js';
import Community from '../models/Community.js';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const suffix = Date.now();
    cb(null, suffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// List of banned words (you can extend this list)
const bannedWordsArray = [
  'damn', 'hell', 'bitch', 'shit', 'fuck', 'asshole', 'idiot', 'bastard',
  'slut', 'whore', 'fag', 'retard', 'cunt', 'nigger', 'chink', 'kike',
  'spic', 'gook', 'dyke', 'paki', 'bimbo', 'douchebag', 'cock', 'penis',
  'tits', 'dick', 'pussy', 'ass', 'motherfucker', 'fucker', 'shithead',
  'bastards', 'fucking', 'bitchass', 'whorehouse', 'rape', 'stupid', 'suck'
];

// Function to detect and flag banned words
function checkForBannedWords(text) {
  let flaggedText = text;

  bannedWordsArray.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Match the word (case-insensitive)
    if (regex.test(flaggedText)) {
      flaggedText = flaggedText.replace(regex, '*'.repeat(word.length)); // Replace with asterisks
    }
  });

  return flaggedText; // Return sanitized text with banned words replaced
}

router.post(
  '/', 
  authenticateJWT, 
  upload.single('photo'), 
  async (req, res) => {
    try {
      const { title, content, Community_name } = req.body;
      const topics = req.body.tags ? req.body.tags.split(',') : []; // Parse topics into an array
      const uname = req.user.username;

      console.log('Parsed Topics:', topics); // Debug parsed topics

      // Find the user
      const person = await Signup.findOne({ username: uname });
      if (!person) return res.status(404).json({ message: "User not found" });

      // Find the community
      const community = await Community.findOne({ name: Community_name });
      if (!community) return res.status(404).json({ message: "Community not found" });

      // Sanitize the title and content
      const sanitizedTitle = checkForBannedWords(title);
      const sanitizedContent = checkForBannedWords(content);

      // File upload path
      const Path = req.file ? req.file.path : null;

      // Save the new post with sanitized title and content
      const PostCreate = new Post({
        title: sanitizedTitle,  // Save sanitized title
        content: sanitizedContent,  // Save sanitized content
        author: person._id,
        community: community._id,
        imgUrl: Path,
        topics, // Save parsed topics array
      });

      await PostCreate.save();
      res.status(200).json({ message: "Post saved successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);






router.post('/vote', authenticateJWT, async (req, res) => {
  try {
    const { postid, upvote, downvote } = req.body;

    // Validate input
    if (!postid || (!upvote && !downvote)) {
      return res.status(400).json({ message: 'Invalid input: postid, upvote, or downvote is required.' });
    }

    // Find the post by ID
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Update the vote count
    if (upvote) {
      post.upvotes += 1; // Increment upvotes
    }
    if (downvote) {
      post.downvotes += 1; // Increment downvotes
    }

    // Save the updated post
    await post.save();

    res.status(200).json({ message: 'Vote updated successfully.', post });
  } catch (err) {
    console.error('Error updating vote:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/getpost', authenticateJWT, async (req, res) => {
  try {
    const { username } = req.user; // Get username from JWT payload

    // Find the user by username
    const user = await Signup.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all posts by the user
    const posts = await Post.find({ author: user._id }).populate('community', 'name');
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this user' });
    }

    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// server.js (or in your routes file)

router.get('/getall', async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await Post.find().sort({ createdAt: -1 }); // Sort by creation date, descending
    res.json(posts); // Send the posts in the response
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});





router.get('/filter', async (req, res) => {
  try {
    const { tags } = req.query; // Get tags from query parameters
    if (!tags) {
      return res.status(400).json({ message: 'Tags are required for filtering.' });
    }

    const tagArray = tags.split(',').map(tag => tag.trim()); // Convert comma-separated tags into an array and remove extra spaces

    // Fetch all posts from the database
    const allPosts = await Post.find().populate('community', 'name').populate('author', 'username');

    // Fuse.js options for fuzzy search
    const options = {
      keys: ['topics'], // Search in the "topics" field
      threshold: 0.3, // Fuzzy matching threshold (lower = stricter match)
      includeScore: true, // Include score in the result (optional)
    };

    const fuse = new Fuse(allPosts, options); // Initialize Fuse.js with the posts

    // Search each tag individually
    const results = tagArray.map(tag => {
      return fuse.search(tag); // Search for each tag in the topics
    }).flat(); // Flatten the array of results (since it's an array of arrays)

    // Remove duplicate posts from results
    const uniqueResults = Array.from(new Set(results.map(result => result.item._id)))
      .map(id => results.find(result => result.item._id === id).item);

    if (uniqueResults.length === 0) {
      return res.status(404).json({ message: 'No posts found for the specified tags.' });
    }

    res.status(200).json(uniqueResults); // Return the filtered posts
  } catch (err) {
    console.error('Error filtering posts:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
