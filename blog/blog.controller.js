const auth = require("../authentication/auth")
const userModel = require("../model/users")
const blogModel = require("../model/blogs")

const createBlog = async (req,res)=>{
    try{

        const {title, description , blogBody, tag} = req.body
       const user = await userModel.findOne({_id:res.locals.user._id})
       if(!user){
        return res.json({
            statusCode:404,
            message:"User not found"
        })
       } 

       const arrayOfWords = blogBody.split(" ")
       const numberOfWords = arrayOfWords.length
       const reading_time = Math.round(numberOfWords/200) // It takes 1min to read 200-250 words by standard
    //    const reading_time = Math.round(blogBody.split(" ").length / 200)     // The man goes to school

       const titleCap = title.toUpperCase()
       const tagCap = tag.toUpperCase()
       const creator = `${res.locals.user.first_name} ${res.locals.user.last_name}`
       const authorCap = creator.toUpperCase()

       const newBlog = await blogModel.create({
        title:titleCap,
        description:description,
        blogBody:blogBody,
        tag:tagCap,
        author:authorCap,
        reading_time:`${reading_time} min`,
        userId:res.locals.user._id

       })

       return res.json({
        statusCode:201,
        message:"Blog created successfully",
        blogInfo:newBlog
    })
    }catch(err){
        return res.json({
            error:err.message
        })
    }
}

module.exports = {createBlog}