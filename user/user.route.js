const express = require ("express")
const middleware = require("./user.middleware")
const controller = require("./user.controller")
const auth = require("../authentication/auth")

const userRouter = express.Router()

userRouter.post("/signup", middleware.validateUserInput, controller.createUser )

userRouter.post("/login", middleware.validateLoginInput, controller.login)

userRouter.get("/dashboard/:page", auth.ensureLogin, controller.openDashboard)

userRouter.get("/authorReadBlog/:id", auth.ensureLogin, controller.authorReadBlog)

userRouter.post("/publishBlog/:id", auth.ensureLogin, controller.publishBlog)

userRouter.post("/updateBlog/:id", auth.ensureLogin, controller.updateBlog)

userRouter.get("/filterBlogByState/:page/:state", auth.ensureLogin, controller.filterBlogByState)

userRouter.post("/deleteBlog/:id", auth.ensureLogin, controller.deleteBlog)

module.exports = userRouter