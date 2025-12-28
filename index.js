const express = require('express')
require('dotenv').config();

const app = express();
const router = require('./routes/user')
const cors = require('cors')
const bodyParser = require('body-parser');
const authRoute = require('./routes/authRoutes');
const connectDb = require('./config/db');


app.use(express.json())
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT

// connect database
connectDb().then(() => app.listen(port, () => {
    console.log(`the server is running http://localhost:${port}`);
})
)

app.use('/api/blogs', router)
app.use("/api/auth", authRoute)
