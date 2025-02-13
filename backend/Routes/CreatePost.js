import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Fuse from 'fuse.js';
import path from 'path';
import fs from 'fs';
import authenticateJWT from '../Authentication/Auth.js';
import Signup from '../models/Signup.js';
import Post from '../models/Post.js';
import Community from '../models/Community.js';

const router = express.Router();

// Ensure uploads directory exists


// Configure multer for file uploads
cloudinary.config({
    cloud_name: 'dvy7hrlmp', // Replace with your Cloudinary cloud name
    api_key: '521133217566947',       // Replace with your Cloudinary API key
    api_secret: 'wGbQBySQ5Q0xoh3G4eQys7SuU38', // Replace with your Cloudinary API secret
  });

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'reddit-app-posts', // Folder in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed formats
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
// Moderation list
const bannedWords = [
    'damn', 'hell', 'bitch', 'shit', 'fuck', 'asshole', 'idiot', 'bastard',
    'slut', 'whore', 'fag', 'retard', 'cunt', 'nigger', 'chink', 'kike',
    'spic', 'gook', 'dyke', 'paki', 'bimbo', 'douchebag', 'cock', 'penis',
    'tits', 'dick', 'pussy', 'ass', 'motherfucker', 'fucker', 'shithead',
    'bastards', 'fucking', 'bitchass', 'whorehouse', 'rape', 'stupid', 'suck'
];

// Utility function to moderate content
const moderateContent = (text) => {
    if (!text) return '';
    let moderated = text;
    bannedWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        moderated = moderated.replace(regex, '*'.repeat(word.length));
    });
    return moderated;
};

// Create Post Route
router.post('/', authenticateJWT, upload.single('photo'), async (req, res) => {
    try {
        console.log('Request received:', req.body);
        console.log('File:', req.file);
        console.log('User:', req.user);

        const { title, content, Community_name } = req.body;
        const { username } = req.user;

        // Validate required fields
        if (!title || !content || !Community_name) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                details: {
                    title: !title ? "Title is required" : null,
                    content: !content ? "Content is required" : null,
                    community: !Community_name ? "Community name is required" : null
                }
            });
        }

        // Find user and community
        const user = await Signup.findOne({ username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const community = await Community.findOne({ name: Community_name });
        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        // Process tags if they exist
        const topics = req.body.tags ? 
            req.body.tags.split(',').map(tag => tag.trim()).filter(Boolean) : 
            [];

        // Handle image upload (Cloudinary)
        let imgUrl = null;
        if (req.file) {
            // Upload image to Cloudinary
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
            imgUrl = cloudinaryResult.secure_url;  // This is the new Cloudinary URL
        }

        // If the image is already uploaded and you're updating the post, you can replace the old image URL:
        if (imgUrl) {
            // You can replace the old image URL with the new one directly in your database.
            // Update the post with the new imgUrl (if any).
            const newPost = new Post({
                title: moderateContent(title),
                content: moderateContent(content),
                author: user._id,
                community: community._id,
                imgUrl: imgUrl,  // New image URL
                topics: topics
            });

            await newPost.save();

            res.status(201).json({
                success: true,
                message: "Post created successfully",
                post: {
                    id: newPost._id,
                    title: newPost.title,
                    community: Community_name,
                    topics: newPost.topics,
                    imgUrl: newPost.imgUrl  // Will contain the updated URL
                }
            });
        } else {
            // If no new image, just create the post without image
            const newPost = new Post({
                title: moderateContent(title),
                content: moderateContent(content),
                author: user._id,
                community: community._id,
                topics: topics
            });

            await newPost.save();

            res.status(201).json({
                success: true,
                message: "Post created successfully",
                post: {
                    id: newPost._id,
                    title: newPost.title,
                    community: Community_name,
                    topics: newPost.topics,
                    imgUrl: null  // No image if not provided
                }
            });
        }

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create post",
            error: error.message
        });
    }
});
// Get user's posts
router.get('/getpost', authenticateJWT, async (req, res) => {
    try {
        const user = await Signup.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const posts = await Post.find({ author: user._id })
            .populate('community', 'name')
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            posts: posts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching posts",
            error: error.message
        });
    }
});

// Get all posts
router.get('/getall', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('community', 'name')
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            posts: posts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching posts",
            error: error.message
        });
    }
});

// Vote on post
router.post('/vote', authenticateJWT, async (req, res) => {
    try {
        const { postId, voteType } = req.body;

        if (!postId || !['upvote', 'downvote'].includes(voteType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vote parameters"
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (voteType === 'upvote') {
            post.upvotes += 1;
        } else {
            post.downvotes += 1;
        }

        await post.save();

        res.json({
            success: true,
            message: "Vote recorded successfully",
            post: {
                id: post._id,
                upvotes: post.upvotes,
                downvotes: post.downvotes
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error recording vote",
            error: error.message
        });
    }
});

// Filter posts by tags
router.get('/filter', async (req, res) => {
    try {
        const { tags } = req.query;

        if (!tags) {
            return res.status(400).json({
                success: false,
                message: "Tags parameter is required"
            });
        }

        const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
        const posts = await Post.find()
            .populate('community', 'name')
            .populate('author', 'username');

        const fuse = new Fuse(posts, {
            keys: ['topics'],
            threshold: 0.3,
            includeScore: true
        });

        const searchResults = tagArray.flatMap(tag => fuse.search(tag));
        const uniqueResults = Array.from(
            new Map(searchResults.map(item => [item.item._id.toString(), item.item]))
            .values()
        );

        res.json({
            success: true,
            posts: uniqueResults
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error filtering posts",
            error: error.message
        });
    }
});

// Error handling middleware
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: "File is too large. Maximum size is 5MB."
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    console.error(err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message
    });
});

export default router;