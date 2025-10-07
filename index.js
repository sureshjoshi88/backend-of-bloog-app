const express =  require('express')
require('dotenv').config()
const app = express();
const connectdb = require('./config/index')
const router = require('./routes/user')
const cors  = require('cors')
const bodyParser = require('body-parser');


app.use(express.json())
app.use(cors());
app.use(bodyParser.json());

connectdb()

app.use('/api/blogs',router)
const port = process.env.PORT
app.listen(port,()=>{
    console.log(`the server is running http://localhost:${port}`);
})
