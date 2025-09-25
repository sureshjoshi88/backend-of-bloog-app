const cloudinary = require("cloudinary").v2;
require('dotenv').config()
const {CloudinaryStorage} = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,

});

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"blogs",
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], },

})

module.exports = {cloudinary,storage}