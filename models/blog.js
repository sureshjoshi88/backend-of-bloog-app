 const mongoose = require('mongoose')
 const blogschema = new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    description:{type:String,required:false},
    images:{type:String,required:true},
    date:{type:Date,default:Date.now,required:true}
 },{timestamps:true})

 module.exports = mongoose.model("blog",blogschema)