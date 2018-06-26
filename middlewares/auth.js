const jwt = require('express-jwt')
require('dotenv').config()

const auth = jwt({
    secret: process.env.SECRET_KEY,
    credentialsRequired: false
})

module.exports = auth