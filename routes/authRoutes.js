const express = require('express')
const { model } = require('mongoose')
const authRoute = express.Router()



authRoute.post("/signup", signupUser)
authRoute.post("/login",loginUser)


module.exports = authRoute