const nodemailer = require("nodemailer")

const transpoter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"abc@gmail.com",
        pass:"hduewhiu"
    }
    
})

const sendMail = async()=>{
    await transpoter.sendMail({
        from:"abc@gmail.com",
        to:"def@gmail.com",
        subject:"Test Mail",
        text:"this is a mail send"
    })
    console.log('mail send')
}
module.exports= sendMail