const express = require('express')
const router = express.Router()
const blogschema = require('../models/blog')

router.get('/blog',async(req,res)=>{
    try {
        const blog = await blogschema.find()
        res.status(200).json({status:true,message:"success",blog})
    } catch (error) {
        res.status(500).json({status:false,message:"something went wrong",error:error})
    }
})

router.post('/blog',(req,res)=>{
    
})

module.exports = router