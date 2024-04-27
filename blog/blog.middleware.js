const joi = require("joi")

const validateBlogInput = async (req, res, next)=>{
    try{
        const blogSchema = await joi.object({
            title:joi.string().required(),
            description:joi.string().required(),
            published_date:joi.string().required(),
            created_date:joi.string().required(),
            tag:joi.string().required(),
            author:joi.string().required(),
            blogBody:joi.string().required(),
        })

        blogSchema.validate(req.body)

        next()

    }catch(err){
        res.json({
            error:err.message
        })
    }
}

module.exports = {validateBlogInput}