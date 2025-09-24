const express = require('express')
const router = express.Router()
const blogschema = require('../models/blog')

router.get('/blog',async(req,res)=>{
    const blog = await blogschema.find()
    res.status(200).json({status:true,message:"success",blog})
})

router.post('/blog',(req,res)=>{
    
})

module.exports = router