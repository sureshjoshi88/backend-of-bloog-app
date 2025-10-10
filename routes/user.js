const express = require('express')
const router = express.Router()
const multer = require("multer")
const { body } = require('express-validator')
const { getuser, addUser, deleteBlog, updateUser, signupUser, loginUser } = require('../controlers/users')
const auth = require('../middleware/auth')





const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/signup", signupUser)
router.post("/login",loginUser)
router.get('/blog', getuser)

router.post("/blog",auth, upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ], addUser)

router.patch("/blog/:id",auth, updateUser)
router.delete("/blog/:id",auth, deleteBlog)



module.exports = router