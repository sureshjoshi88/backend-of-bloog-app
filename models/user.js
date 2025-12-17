const mongoose = require('mongoose')
const userschema = new mongoose.Schema({
    name: {
        type: String, required: true, trim: true ,
    },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
        type: String, required: true
    }
})

const user = mongoose.model("user", userschema);
module.exports = user 