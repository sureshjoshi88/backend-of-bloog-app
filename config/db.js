const mongoose = require('mongoose')
require('dotenv').config()


const connectDb = async() => {
    try {
         await  mongoose.connect(process.env.DB_URL).then(()=>{
        console.log('db connected');
    })
    } catch (error) {
        console.log('db error ',error);
        
    }
 
}
module.exports = connectDb