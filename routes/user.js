const express = require('express')
const router = express.Router()
const blogschema = require('../models/blog')
const multer = require("multer")
const { body, validationResult } = require('express-validator')
const { storage } = require("../config/cloudinary")


const upload = multer({ storage });



router.get('/blog', async (req, res) => {
    try {
        const blog = await blogschema.find()
        res.status(200).json({ status: true, message: "success", blog })
    } catch (error) {
        res.status(500).json({ status: false, message: "something went wrong", error: error })
    }
})

router.post('/blog', upload.single('images'),
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('description').trim().notEmpty().withMessage('Description is required'),
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }

        try {
            const { title, description, date } = req.body;

            const blog = new blogschema({
                title,
                description,
                date: date ? new Date(date) : new Date(),
                images: req.file ? req.file.path : req.body.images, // Cloudinary URL
            });

            await blog.save();

            return res.status(201).json({ status: true, message: 'Blog created', blog });
        } catch (err) {
            console.error('Create blog error:', err);
            return res.status(500).json({ status: false, message: 'Server error' });
        }

    })

module.exports = router