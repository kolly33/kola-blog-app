const express = require("express")
const middleware = require("./blog.middleware")
const controller = require("./blog.controller")
const auth = require("../authentication/auth")

const blogRouter = express.Router()

blogRouter.post("/createBlog", middleware.validateBlogInput, auth.ensureLogin, controller.createBlog)

module.exports = blogRouter