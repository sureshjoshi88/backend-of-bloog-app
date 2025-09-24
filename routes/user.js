const express = require('express')
const router = express.Router()
const blogschema = require('../models/blog')

router.get('/',async(req,res)=>{
    const blog = await blogschema.find()
    res.status(200).json({status:true,message:"success",blog})
})

module.exports = router