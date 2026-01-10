const { validationResult } = require("express-validator");
const blogschema = require("../models/blog");
const mongoose = require("mongoose");
const uploadToCloudinary = require("../utils/cloudinary");
const cloudinary = require('cloudinary').v2;




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
    res.status(500).json({ status: false, message: "server error", error: error })
    console.log(error);

  }
}


const addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  }

  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ status: false, message: 'Image is required' });
    }

    // Upload to cloudinary
    const result = await uploadToCloudinary(req.file.buffer);
    const blog = new blogschema({
      title,
      description,
      image: result.secure_url,
      public_id: result.public_id,
    });

    await blog.save();

    return res.status(201).json({
      status: true,
      message: 'Blog created successfully',
      blog,
    });

  } catch (err) {
    console.error('Create blog error:', err);
    return res.status(500).json({ status: false, message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  const { title, description } = req.body

  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: false, message: "Invalid blog ID" });
  }
  if (!title || !description) {
    return res.status(400).json({ status: false, message: "all field are required" })
  }


  try {

    const blogs = await blogschema.findByIdAndUpdate(id, { title, description }, { new: true })
    if (!blogs) {
      return res.status(404).json({ status: false, message: "user not found" })
    }
    res.status(200).json({ status: true, message: "user updated by successfully", blogs })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        status: false,
        message: "Invalid blog ID",
      });
    }
    res.status(500).json({ status: false, error: error.message })
  }
}

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid blog ID" });
    }
    const check = await blogschema.findById(id);
    if (!check) {
      return res.status(404).json({ status: false, message: "blog not found" });
    }

    if (check.public_id) {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(check.public_id);
    }
    const blogs = await blogschema.findByIdAndDelete(id)
    res.status(200).json({ status: true, message: "blog delete successfully", blog: blogs })
  } catch (error) {
    res.status(500).json({ status: false, message: "server error", error: error.message });
    console.log(error);
  }
}
module.exports = { getuser, addUser, deleteBlog, updateUser }