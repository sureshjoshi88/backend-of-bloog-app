const cloudinary = require("cloudinary").v2;
// const multer = require('multer');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,

});


// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const storage = new CloudinaryStorage({
//     cloudinary:cloudinary,
//     params:{
//         folder:"blogs",
//         allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], },

// })

module.exports = {cloudinary}