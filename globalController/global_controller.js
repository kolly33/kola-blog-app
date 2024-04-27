const userModel = require("../model/users")
const blogModel = require("../model/blogs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const {DateTime} = require("luxon")


const visitorGetBlog = async (req,res)=>{
    try{
       let page = req.params.page || 0
       const blogPerPage = 20
   
       const blogs = await blogModel
       .find({state:"published"})
       .skip(blogPerPage * page)
       .limit(blogPerPage )
       .populate("userId", "first_name last_name")
   
       if(blogs.length == 0){
           return res.json({
               statusCode:404,
               message:"Blogs not found"
           })
       }
   
   
       let blogsArray = []
       for(const blog of blogs){
           const neededInfo = {
               title:blog.title,
               author:blog.author,
               tag:blog.tag,
               description:blog.description,
               read_count:blog.read_count,
               reading_time:blog.reading_time,
               state:blog.state,
               publisher:`${blog.userId.first_name} ${blog.userId.last_name}`,
               readBlogUrl:`http://localhost:4050/visitorReadBlog/${blog._id}`,
           }
   
           blogsArray.push(neededInfo)
       }
   
       return res.json({
           statusCode:200,
           blogs:blogsArray
       })
   
    }catch(err){
       return res.json({
           stausCode:400,
           error:err.message
       })
    }
   }

   const sortBlogBytitle = async (req,res)=>{
    try{

        const title = req.query.title

        const titleCap = title.toUpperCase()

        let page = req.params.page || 0
        const blogPerPage = 20

        const blogs = await blogModel.find({title:titleCap})
        .skip(blogPerPage * page)
        .limit(blogPerPage)

        if(blogs.length == 0){
            return res.json({
                statusCode:404,
                message:"Opps!! Blogs not found"
            })
        }

    let blogsArray = []
    for(const blog of blogs){
        const neededInfo = {
            title:blog.title,
            author:blog.author,
            tag:blog.tag,
            description:blog.description,
            read_count:blog.read_count,
            reading_time:blog.reading_time,
            state:blog.state,
            readBlogUrl:`http://localhost:4050/visitorReadBlog/${blog._id}`,
        }

        blogsArray.push(neededInfo)
    }

    return res.json({
        statusCode:200,
        blogs:blogsArray
    })


    }catch(err){
        return res.json({
            stausCode:400,
            error:err.message
        })
    }
}

//=====================================================

const sortBlogBytag = async (req,res)=>{
    try{

        const tag = req.query.tag

        const tagCap = tag.toUpperCase()

        let page = req.params.page || 0
        const blogPerPage = 20

        const blogs = await blogModel.find({tag:tagCap})
        .skip(blogPerPage * page)
        .limit(blogPerPage)

        if(blogs.length == 0){
            return res.json({
                statusCode:404,
                message:"Opps!! Blogs not found"
            })
        }

    let blogsArray = []
    for(const blog of blogs){
        const neededInfo = {
            title:blog.title,
            author:blog.author,
            tag:blog.tag,
            description:blog.description,
            read_count:blog.read_count,
            reading_time:blog.reading_time,
            state:blog.state,
            readBlogUrl:`http://localhost:4050/visitorReadBlog/${blog._id}`,
        }

        blogsArray.push(neededInfo)
    }

    return res.json({
        statusCode:200,
        blogs:blogsArray
    })


    }catch(err){
        return res.json({
            stausCode:400,
            error:err.message
        })
    }
}


//=====================================================

const sortBlogByAuthor = async (req,res)=>{
    try{

        const author = req.query.author

        const authorCap = author.toUpperCase()

        let page = req.params.page || 0
        const blogPerPage = 20

        const blogs = await blogModel.find({author:authorCap})
        .skip(blogPerPage * page)
        .limit(blogPerPage)

        if(blogs.length == 0){
            return res.json({
                statusCode:404,
                message:"Opps!! Blogs not found"
            })
        }

    let blogsArray = []
    for(const blog of blogs){
        const neededInfo = {
            title:blog.title,
            author:blog.author,
            tag:blog.tag,
            description:blog.description,
            read_count:blog.read_count,
            reading_time:blog.reading_time,
            state:blog.state,
            readBlogUrl:`http://localhost:4050/visitorReadBlog/${blog._id}`,
        }

        blogsArray.push(neededInfo)
    }

    return res.json({
        statusCode:200,
        blogs:blogsArray
    })


    }catch(err){
        return res.json({
            stausCode:400,
            error:err.message
        })
    }
}


//--------------------------------------------------------------------------

const visitorReadBlog = async (req,res)=>{
    try{

        const blog = await blogModel.findOne({_id:req.params.id})

        if(!blog){
            return res.json({
                statusCode:404,
                message:"Opps!! Blog not found"
            })
        }

        blog.read_count++
        blog.save()

        const neededInfo = {
            title:blog.title,
            author:blog.author,
            blogBody:blog.blogBody,
        }

        return res.json({
            statusCode:200,
            blogDetails:neededInfo 
        })

    }catch(err){
        return res.json({
            stausCode:400,
            error:err.message
        })
    } 

}

module.exports = {
    visitorGetBlog, 
    sortBlogBytitle,
    sortBlogBytag,
    sortBlogByAuthor,
    visitorReadBlog
}