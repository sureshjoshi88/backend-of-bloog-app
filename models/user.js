const mongoose = require('mongoose')
const userschema = new mongoose.Schema({
    fullName: {
        type: String, required: true,
    },
    email: { type: String, required: true, unique: true ,lowercase: true, trim: true},
    password: {
        type: String, required: true
    }
})

const user = mongoose.model("user",userschema);
module.exports = user 