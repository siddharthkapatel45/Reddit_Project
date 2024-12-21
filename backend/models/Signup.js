import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define the signup schema
const signupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  
  // Array of references to other users (followers/following)
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Signup' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Signup' }],
  
  imgUrl: { type: String, default: "/" },
  description: { type: String, default: "Add your description Here" },
  mature: { type: Boolean, default: false }
});

// Pre-save middleware to hash the password
signupSchema.pre('save', async function (next) {
  const user = this;

  // Only hash the password if it is new or modified
  if (!user.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error); // Pass errors to the next middleware
  }
});

// Compare hashed passwords (for login verification)
signupSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the model
const Signup = mongoose.model('Signup', signupSchema);

export default Signup;
