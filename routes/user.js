const express = require('express')
const router = express.Router()
const multer = require("multer")
const { body } = require('express-validator')
const { getuser, addUser, deleteBlog, updateUser } = require('../controlers/users')





const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/blog', getuser)

router.post("/blog", upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ], addUser)

router.patch("/blog/:id", updateUser)
router.delete("/blog/:id", deleteBlog)



module.exports = router