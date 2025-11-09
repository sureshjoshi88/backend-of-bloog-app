 const mongoose = require('mongoose')
 const blogschema = new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    description:{type:String,required:true},
    image:{type:String,required:true},
    date:{type:String}
 },{timestamps:true})

 module.exports = mongoose.model("blog",blogschema)