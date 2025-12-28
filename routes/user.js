const express = require('express')
const router = express.Router()
const multer = require("multer")
const { body } = require('express-validator')
const { getuser, addUser, deleteBlog, updateUser } = require('../controlers/users')
const auth = require('../middleware/auth')





const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.get('/blog', getuser)

router.post("/blog",auth, upload.single('image'), addUser)

router.put("/blog/:id",auth, updateUser)
router.delete("/blog/:id",auth, deleteBlog)



module.exports = router