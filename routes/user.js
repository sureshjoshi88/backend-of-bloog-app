const express = require('express')
const router = express.Router()
const blogschema = require('../models/blog')
const multer = require("multer")
const { body, validationResult } = require('express-validator')
const { cloudinary } = require('../config/cloudinary')
// const { storage,upload } = require("../config/cloudinary")



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/blog', async (req, res) => {
    try {
        const blog = await blogschema.find()
        const title =req.query
        
        res.status(200).json({ status: true, message: "success", blog })
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





// router.post('/upload', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
//     if (error) {
//       console.log(error);
//       return res.status(500).json({ error: 'Error uploading to Cloudinary' });
//     }

//      const { title, description, date } = req.body;

//             const blog = new blogschema({
//                 title,
//                 description,
//                 date: date ? new Date(date) : new Date(),
//                 images: req.file ? req.file.path : null, // Cloudinary URL
//             });

//             await blog.save();
//     res.json({ public_id: result.public_id, url: result.secure_url });

//   }).end(req.file.buffer);
// });

module.exports = router