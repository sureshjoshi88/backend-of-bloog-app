
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();


const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

const signupUser = async(req,res)=>{
    try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password required' });

    // check existing user
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    // hash password
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await new User({ name, email, password: hashed });
    await user.save();

    // create JWT (you may exclude sensitive fields)
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

    res.status(201).json({
      message: 'User created',
      user: { id: user._id, name: user.name, email: user.email },
      token:token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({status:false, message: 'Server error' ,error:err.message});
  }
}



const loginUser = async(req,res)=>{
   try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({status:false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({status:false, message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

    res.json({status:true,
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({status:false, message: 'Server error' });
  }
}


module.exports  = {signupUser,loginUser}