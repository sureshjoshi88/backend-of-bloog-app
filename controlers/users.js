const { validationResult } = require("express-validator");
const blogschema = require("../models/blog");
const { cloudinary } = require("../config/cloudinary");
const mongoose = require("mongoose");


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
const {title} = req.body
const {id} = req.params
if(!title){
  return res.status(400).json({status:false,message:"title is required"})
}

try {
 const blogs  = await blogschema.findByIdAndUpdate(id,{title},{new:true})
  if(!blogs){
    res.status(404),json({status:false,message:"user not found"})
  }
  res.status(200).json({status:true,message:"user updated by successfully",blogs})
} catch (error) {
  
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

module.exports = { getuser, addUser, deleteBlog,updateUser }