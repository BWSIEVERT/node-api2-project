// Needed to npm install express - server now starts with message.

const express = require('express')

const server = express()
const postsRouter = require('./posts-router')

// Import Routers into server.js
server.use('/api/posts', postsRouter)



server.use(express.json())

module.exports = server