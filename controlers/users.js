const { validationResult } = require("express-validator");
const blogschema = require("../models/blog");
const { cloudinary } = require("../config/cloudinary");
const mongoose = require("mongoose");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();


const getuser = async (req, res) => {
  try {
    const { title } = req.query
    if (title) {
      const blogs = await blogschema.find({ title: { $regex: title, $options: "i" } }
      )
      if (blogs.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No blog found with this title"
        });
      }
      return res.status(200).json({ status: true, message: "success", blog: blogs })
    }
    const blog = await blogschema.find()
    res.status(200).json({ status: true, message: "success", blog: blog })
  } catch (error) {
    res.status(500).json({ status: false, message: "something went wrong", error: error })
  }
}

const addUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  }

  try {
    const { title, description, date } = req.body;

    if (!req.file) {
      return res.status(400).json({ status: false, message: 'Image is required' });
    }

    // Cloudinary upload
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'blogs' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ status: false, message: 'Cloudinary error' });
        }

        // Save blog in DB
        const blog = new blogschema({
          title,
          description,
          date: date ? new Date(date) : new Date(),
          image: result.secure_url,
          public_id: result.public_id,
        });

        await blog.save();

        return res.status(201).json({ status: true, message: 'Blog created', blog });
      }
    ).end(req.file.buffer);

  } catch (err) {
    console.error('Create blog error:', err);
    return res.status(500).json({ status: false, message: 'Server error' });
  }

}

const updateUser = async (req,res) => {
const {title,description} = req.body
const {id} = req.params

 if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid blog ID" });
    }
if(!title || !description){
 return res.status(400).json({status:false,message:"all field are required"})
}


try {
 const blogs  = await blogschema.findByIdAndUpdate(id,{title,description},{new:true})
  if(!blogs){
   return res.status(404),json({status:false,message:"user not found"})
  }
  res.status(200).json({status:true,message:"user updated by successfully",blogs})
} catch (error) {
   if (error.name === "CastError") {
      return res.status(400).json({
        status: false,
        message: "Invalid blog ID",
      });
    }
  res.status(500).json({status:false,error:error.message})
}
}

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid blog ID" });
    }
    const blogs = await blogschema.findByIdAndDelete(id)
    if (!blogs) {
      return res.status(400).json({ status: false, message: "blog not found" })
    }
    res.status(200).json({ status: true, message: "blog delete successfully", blog: blogs })
  } catch (error) {
    res.status(500).json({ status: false, message: "server error", error: error.message });
    console.log(error);

  }
}

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

    const user = new User({ name, email, password: hashed });
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
    res.status(500).json({ message: 'Server error' });
  }
}


const loginUser = async(req,res)=>{
   try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
module.exports = { getuser, addUser, deleteBlog,updateUser ,signupUser,loginUser}