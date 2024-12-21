import express from 'express';
import authenticateJWT from '../Authentication/Auth.js';
import Signup from '../models/Signup.js';

const router = express.Router();

router.post('/', authenticateJWT, async (req, res) => {
  const { username } = req.body;
  const my_username = req.user.username;

  try {
    // Find both the person who is logged in (Person1) and the target person to follow (Person2)
    const Person1 = await Signup.findOne({ username: my_username });
    const Person2 = await Signup.findOne({ username: username });

    if (!Person1 || !Person2) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if Person1 is already following Person2
    if (Person1.following.includes(Person2._id)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    // Add Person2 to Person1's following list
    Person1.following.push(Person2._id);

    // Add Person1 to Person2's followers list
    Person2.followers.push(Person1._id);

    // Save both documents after updating their relationship
    await Person1.save();
    await Person2.save();     

    return res.status(200).json({ message: 'Followed successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
