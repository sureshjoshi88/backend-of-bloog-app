const nodemailer = require("nodemailer")

const transpoter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"abc@gmail.com",
        pass:"hduewhiu"
    }
    
})

