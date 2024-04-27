const express = require("express")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
dotenv.config()
const db = require("./config/mongoose")
const userRouter = require("./user/user.route")
const blogRouter = require("./blog/blog.route")
const cookieParser = require("cookie-parser")
const globalController = require("./globalController/global_controller")

const app = express()
const PORT = process.env.PORT

db.connectToMongoDB()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())

app.use("/user", userRouter)
app.use("/blog", blogRouter)

app.get("/", (req,res)=>{
    res.json({
        message:"Welcome to kola's Blog"
    })
})

app.get("/visitorGetBlog/:page", globalController.visitorGetBlog)

app.get("/visitorReadBlog/:id", globalController.visitorReadBlog)

app.get("/sortBlogBytitle/:page", globalController.sortBlogBytitle)

app.get("/sortBlogBytag/:page", globalController.sortBlogBytag)

app.get("/sortBlogByAuthor/:page", globalController.sortBlogByAuthor)


app.get("/logout", (req,res)=>{
    res.clearCookie("jwt")
    res.json({
        statusCode:200,
        error:"You are logged out successfully"
    })
})

// Handling of error due to request to not existing route
app.get("*", (res)=>{
    res.json({
        statusCode:404,
        error:"page not found"
    })
})

//global error handler

app.use((res)=>{
    res.json({
        statusCode:500,
        error:"Opps!! Something broke"
    })
})


app.listen(PORT, ()=>{
    console.log(`app listening at http://localhost:${PORT}`)
})