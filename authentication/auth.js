const jwt = require("jsonwebtoken")
require("dotenv").config()

const ensureLogin = async (req,res, next)=>{
    try{
        console.log("I am here")

        // const token = req.rawHeaders[3].split("=")[1]
        const token = req.cookies.jwt

        if(!token){
            return res.json({
                statusCode:403,
                message:"Opps!! jwt required"
            })
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET)

        res.locals.user = decoded

        next()

    }catch(err){
        return res.json({
            statusCode:400,
            error:err.message
        })
    }
}

module.exports = {ensureLogin}