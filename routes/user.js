const express = require('express')
const router = express.Router()
const multer = require("multer")
const {  deleteBlog, updateBlog, addBlog, getBlog } = require('../controlers/users')
const auth = require('../middleware/auth')





const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.get('/blog', getBlog)

router.post("/blog",auth, upload.single('image'), addBlog)

router.put("/blog/:id",auth, updateBlog)
router.delete("/blog/:id",auth, deleteBlog)



module.exports = router