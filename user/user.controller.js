const userModel = require("../model/users")
const blogModel = require("../model/blogs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const {DateTime} = require("luxon")

const createUser = async (req,res)=>{
    try{
    
    const {first_name, last_name , email, password, phoneNum} = req.body

    const existingUser = await userModel.findOne({email:email})

    if(existingUser){
        return res.json({
            statusCode:409,
            message:"Opps!! User already exist"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

   const newUser = await userModel.create({
    first_name:first_name,
    last_name:last_name,
    password:hashedPassword,
    email:email,
    phoneNum:phoneNum

   })

   return res.json({
    statusCode:201,
    message:"User created successfully",
    newUser:newUser
   })

    }catch(err){
        return res.json({
            stausCode:400,
            error:err.message
        })
    }
}


const login = async (req,res)=>{
 try{
    const {email, password} = req.body

    const user = await userModel.findOne({email:email})

    if(!user){
        return res.json({
            stausCode:404,
            message:"Opps!! User not found"
        })
    }

    const isValidPassword = await bcrypt.compare(password, user.password) //kola123  ,  $2b$10$r4zq2nVbYGatePVj.EfESujCxUUwWEPUKPNM017c36cFVhnkvqJ5m

    if(!isValidPassword){
        return res.json({
            statusCode:401,
            message:"Opps!! email or password is incorrect"
        })
    }

    const payload = {first_name:user.first_name, last_name:user.last_name, _id:user._id, email:user.email}

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"1h"} )

    res.cookie("jwt", token, {maxAge:60 * 60 * 1000})

    res.json({
        statusCode:200,
        message:"Successful login"
    })

 }catch(err){
    return res.json({
        stausCode:400,
        error:err.message
    })
 }
}

const openDashboard = async (req,res)=>{
 try{
    const user = await userModel.findOne({_id:res.locals.user._id})
    if(!user){
        return res.json({
            stausCode:404,
            message:"Opps!! User not found"
        })
    }

    let page = req.params.page || 0
    const blogPerPage = 5

    const blogs = await blogModel
    .find({userId:res.locals.user._id})
    .skip(blogPerPage * page)
    .limit(blogPerPage )

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
            readBlogUrl:`http://localhost:4050/user/authorReadBlog/${blog._id}`,
            filterBlogUrl:`http://localhost:4050/user/filterBlogByState`
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

const authorReadBlog = async (req,res)=>{
    try{
        const user = await userModel.findOne({_id:res.locals.user._id})
        if(!user){
            return res.json({
                stausCode:404,
                message:"Opps!! User not found"
            })
        } 

        const blog = await blogModel.findOne({_id:req.params.id})

        if(!blog){
            return res.json({
                statusCode:404,
                message:"Opps!! Blog not found"
            })
        }

        const neededInfo = {
            title:blog.title,
            author:blog.author,
            blogBody:blog.blogBody,
            state:blog.state,
            blogPublishUrl:`http://localhost:4050/user/publishBlog/${blog._id}`,
            blogUpdateUrl:`http://localhost:4050/user/updateBlog/${blog._id}`,
            blogDeleteUrl:`http://localhost:4050/user/deleteBlog/${blog._id}`,
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


//---------------------------------------------------------------------------

const publishBlog = async (req,res)=>{
    try{

        const user = await userModel.findOne({_id:res.locals.user._id})
        if(!user){
            return res.json({
                stausCode:404,
                message:"Opps!! User not found"
            })
        } 

        const id = req.params.id

        const blog = await blogModel.findByIdAndUpdate(id, {state:"published"})

        blog.published_date = DateTime.now().toFormat("LLL d, yyyy \'at\' HH:mm")
       
        blog.save()

        return res.json({
            statusCode:201,
            message:"Blog published successfully"
        })

    }catch(err){
        return res.json({
            stausCode:400,
            error:err.message
        })
    }
}


//---------------------------------------------------------------------------

const updateBlog = async (req,res)=>{
    try{

        const {blogUpdate} = req.body

        const user = await userModel.findOne({_id:res.locals.user._id})
        if(!user){
            return res.json({
                stausCode:404,
                message:"Opps!! User not found"
            })
        } 

        const id = req.params.id

        const blog = await blogModel.findByIdAndUpdate(id, {blogBody:`${blogUpdate}`})

        blog.published_date = DateTime.now().toFormat("LLL d, yyyy \'at\' HH:mm")
       
        blog.save()

        return res.json({
            statusCode:201,
            message:"Blog updated successfully"
        })

    }catch(err){
        return res.json({
            stausCode:400,
            error:err.message
        })
    }
}



const filterBlogByState = async (req,res)=>{
    try{

        const state = req.params.state 

        const user = await userModel.findOne({_id:res.locals.user._id})
        if(!user){
            return res.json({
                stausCode:404,
                message:"Opps!! User not found"
            })
        } 

        let page = req.params.page || 0
        const blogPerPage = 5

        const blogs = await blogModel.find({userId:user._id, state:`${state}`})
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
            readBlogUrl:`http://localhost:4050/user/authorReadBlog/${blog._id}`,
            filterBlogUrl:`http://localhost:4050/user/filterBlogByState`
        }

        blogsArray.push(neededInfo)
    }

    return res.json({
        statusCode:200,
        message:`Below are the ${state} blogs`,
        blogs:blogsArray
    })


    }catch(err){
        return res.json({
            stausCode:400,
            error:err.message
        })
    }
}


//---------------------------------------------------------------------------

const deleteBlog = async (req,res)=>{
    try{

        const user = await userModel.findOne({_id:res.locals.user._id})
        if(!user){
            return res.json({
                stausCode:404,
                message:"Opps!! User not found"
            })
        } 

        const id = req.params.id

        await blogModel.findByIdAndDelete(id)

        return res.json({
            statusCode:200,
            message:"Blog deleted successfully"
        })

    }catch(err){
        return res.json({
            stausCode:400,
            error:err.message
        })
    }
}


module.exports = {
    createUser,
     login,
     openDashboard,
     authorReadBlog,
     publishBlog ,
     updateBlog,
     filterBlogByState,
     deleteBlog
    }