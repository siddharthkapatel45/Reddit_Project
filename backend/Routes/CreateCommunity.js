import express from 'express';
import multer from 'multer';

import authenticateJWT from '../Authentication/Auth.js';
import Community from '../models/Community.js';
import Signup from '../models/Signup.js';
import Post from '../models/Post.js';
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const suffix = Date.now();
    cb(null, `${suffix}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Create Community API
router.post('/', authenticateJWT, upload.single('photo'), async (req, res) => {
  try {
    const { name, description, topics } = req.body;
    const uname = req.user.username;

    // Find the user in the database
    const user = await Signup.findOne({ username: uname });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a community with the same name already exists
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ message: "Community with this name already exists" });
    }

    // Handle file upload
    const imgUrl = req.file ? req.file.path : "/default-community-image.jpg";

    // Create the new community
    const newCommunity = new Community({
      name,
      description,
      topics: JSON.parse(topics),
      createdBy: user._id,
      members: [user._id],
      imgUrl,
    });

    await newCommunity.save();
    res.status(201).json({ message: "Community created successfully", community: newCommunity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
router.post('/getbyid', async (req, res) => {
  const { community_id } = req.body;

  // Validate request body
  if (!community_id) {
    return res.status(400).json({ message: 'community_id is required' });
  }

  try {
    // Find the community by community_id
    const community = await Community.findById(community_id);

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Respond with the community data
    res.status(200).json({
      name: community.name,
      description: community.description,
      members: community.members,
      createdAt: community.createdAt,
      imgUrl:community.imgUrl
    });
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/getMembers', async (req, res) => {
  const { community_id } = req.body;

  try {
    // Find the community by ID
    const community = await Community.findById(community_id);

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Fetch the members of the community
    const members = await User.find({ _id: { $in: community.members } });

    // Return the members data
    res.json({ members });
  } catch (error) {
    console.error('Error fetching members:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// Join Community API
router.post('/joincom', authenticateJWT, async (req, res) => {
  const commname = req.body.comname; // Correctly extract data from the request body
  const uname = req.user.username;  // Extract the authenticated username

  console.log('Community Name:', commname);
  console.log('Username:', uname);

  try {
    const community = await Community.findOne({ _id: commname });

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Ensure 'members' field exists
    if (!community.members) {
      community.members = [];
    }

    // Add the user to the members list if they are not already in it
    if (!community.members.includes(uname)) {
      community.members.push(uname);
      await community.save();
    }

    return res.status(200).json({ message: 'Successfully joined the community', community });
  } catch (error) {
    console.error('Error in /joincom route:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
// Get Community Details API
// Get All Community Names API
router.get('/getcom',  async (req, res) => {
  try {
    // Fetch all community names from the database
    const communities = await Community.find({}, 'name');  // Only retrieve the 'name' field

    if (!communities || communities.length === 0) {
      return res.status(404).json({ message: 'No communities found' });
    }

    // Return the list of community names
    res.status(200).json({
      message: 'All communities fetched successfully',
      communities: communities.map(community => community.name), // Map to only return the community names
    });
  } catch (error) {
    console.error('Error in /getAllCommunities route:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


// Community search API
router.get('/search', async (req, res) => {
  try {
    // Fetch all communities from the database
    const communities = await Community.find();
    res.json(communities); // Return the list of communities
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ message: 'Failed to fetch communities' });
  }
});
router.post('/getStats', async (req, res) => {
  const { community_id } = req.body;

  if (!community_id) {
    return res.status(400).json({ message: 'community_id is required' });
  }

  try {
    // Fetch community details by ID
    const community = await Community.findById(community_id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Get all posts in the community
    const posts = await Post.find({ community: community_id }).populate('author');

    if (!posts) {
      return res.status(404).json({ message: 'No posts found' });
    }

    // 1. Highest contributors: Count posts by each user (author)
    const contributorCounts = posts.reduce((acc, post) => {
      acc[post.author.username] = (acc[post.author.username] || 0) + 1;
      return acc;
    }, {});

    // 2. Trending topics: Count frequency of each tag
    const topicCounts = posts.reduce((acc, post) => {
      post.topics.forEach((topic) => {
        acc[topic] = (acc[topic] || 0) + 1;
      });
      return acc;
    }, {});

    // Get the top 5 highest contributors
    const highestContributors = Object.entries(contributorCounts)
      .map(([username, count]) => ({ username, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get the top 5 trending topics
    const trendingTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.status(200).json({ community, highestContributors, trendingTopics });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Get Communities Created by Authenticated User
router.get('/mycommunities', authenticateJWT, async (req, res) => {
  try {
    const uname = req.user.username; // Get the username of the authenticated user

    // Find the user in the database
    const user = await Signup.findOne({ username: uname });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all communities created by the authenticated user
    const communities = await Community.find({ createdBy: user._id });

    if (!communities || communities.length === 0) {
      return res.status(404).json({ message: "No communities found for this user" });
    }

    // Return the communities created by the authenticated user
    res.status(200).json({
      message: 'Communities fetched successfully',
      communities: communities.map(community => ({
        name: community.name,
        description: community.description,
        imgUrl: community.imgUrl,
        createdAt: community.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



export default router;
