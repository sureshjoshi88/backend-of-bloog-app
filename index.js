const express =  require('express')
require('dotenv').config()
const app = express();
const connectdb = require('./config/index')
const router = require('./routes/user')

app.use(express.json())
connectdb()

app.use('/api/user',router)
const port = process.env.PORT
app.listen(port,()=>{
    console.log(`the server is running http://localhost:${port}`);
})
