const mongoose = require('mongoose')

const connectDb = () => {
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log('db connected');
    }).catch((err)=>{
        console.log('db error',err);
        
    })
}
module.exports = connectDb