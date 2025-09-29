const express = require('express')
const router = express.Router()
const blogschema = require('../models/blog')
const multer = require("multer")
const { body, validationResult } = require('express-validator')
const { cloudinary } = require('../config/cloudinary')



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/blog', async (req, res) => {
    try {
        const {title} =req.query
        if(title){
          const blogs = await blogschema.find( { title: { $regex: title, $options: "i" }} 
)
           if (blogs.length === 0) {
                return res.status(404).json({ 
                    status: false, 
                    message: "No blog found with this title" 
                });
            }
         return res.status(200).json({ status: true, message: "success", blog:blogs })
        }
        const blog = await blogschema.find()
        res.status(200).json({ status: true, message: "success", blog})
    } catch (error) {
        res.status(500).json({ status: false, message: "something went wrong", error: error })
    }
})



router.post('/blog',
  upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  async (req, res) => {
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
        { resource_type: 'auto', folder: 'blogs' }, // optional folder
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
            image: result.secure_url,   // Cloudinary ka URL store hoga
            public_id: result.public_id, // agar future me delete/update karna ho
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
);


module.exports = router