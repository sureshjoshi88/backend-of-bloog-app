 const mongoose = require('mongoose')
 const blogschema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    images:{type:String,required:true},
    date:{type:Date,default:Date.now}
 },{timestamps:true})

 module.exports = mongoose.model("blog",blogschema)