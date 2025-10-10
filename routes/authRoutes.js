const express = require('express')
const { signupUser, loginUser } = require('../controlers/authenction')
const authRoute = express.Router()



authRoute.post("/signup", signupUser)
authRoute.post("/login",loginUser)


module.exports = authRoute