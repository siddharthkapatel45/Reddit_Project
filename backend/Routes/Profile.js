import express, { response } from 'express';
import multer from 'multer';
const router = express.Router();
import authenticateJWT from '../Authentication/Auth.js';
import Signup from '../models/Signup.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
cloudinary.config({
  cloud_name: 'dvy7hrlmp', // Replace with your Cloudinary cloud name
  api_key: '521133217566947',       // Replace with your Cloudinary API key
  api_secret: 'wGbQBySQ5Q0xoh3G4eQys7SuU38', // Replace with your Cloudinary API secret
});

// import path from 'path';
// Profile API
router.get('/', authenticateJWT,async (req,res)=>{
    const uname=req.user.username;
    const Person= await Signup.findOne({username:uname});

      res.status(200).json(Person);
    })

    
    // Simulate __dirname in ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'reddit-app', // Folder in your Cloudinary account
        allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed image formats
      },
    });
    
    const upload = multer({ storage });

    // Edit Profile API
   // Edit Profile API
   router.post('/edit', authenticateJWT, upload.single('photo'), async (req, res) => {
    const uname = req.user.username;
    const { name, email, desc, mature } = req.body;
  
    try {
      const person = await Signup.findOne({ username: uname });
      if (!person) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Use Cloudinary URL if a new image is uploaded
      const imageUrl = req.file ? req.file.path : person.imgUrl;
  
      const result = await Signup.updateOne(
        { username: uname },
        {
          $set: {
            name: name || person.name,
            email: email || person.email,
            description: desc || person.description,
            imgUrl: imageUrl,
            mature: mature !== undefined ? mature : person.mature,
          },
        }
      );
  
      res.status(200).json({ message: 'User updated successfully', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.get('/getuname',authenticateJWT,async(req,res)=>{
    // response.send(req.user.username);
    const Person=await Signup.findOne({username:req.user.username});
    res.send(Person.imgUrl);
  })
  // fetch user details based on username
  router.post('/getPersonByUsername', async (req, res) => {
    const { username } = req.body;
  
    // Validate request body
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
  
    try {
      // Fetch the person by username
      const person = await Signup.findOne({ username }); // Exclude password for security
  
      if (!person) {
        return res.status(404).json({ message: 'Person not found' });
      }
  
      // Respond with the person's data
      res.status(200).json({
        name: person.name,
        username: person.username,
        email: person.email,
        imgUrl: person.imgUrl,
        description: person.description,
        followers: person.followers.length,
        following: person.following.length,
        createdAt: person.createdAt,
      });
    } catch (error) {
      console.error('Error fetching person data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

    router.get('/getimg', authenticateJWT, async (req, res) => {
      const username = req.user.username;  // Correctly extract username from req.user
    
      // Validate request body
      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }
    
      try {
        // Fetch the person by username
        const person = await Signup.findOne({ username }); // Exclude password for security
    
        if (!person) {
          return res.status(404).json({ message: 'Person not found' });
        }
    
        // Respond with the person's data
        res.status(200).json({
          imgUrl: person.imgUrl,
        });
      } catch (error) {
        console.error('Error fetching person data:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
    
  

export default router;
