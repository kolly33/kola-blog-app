const joi = require("joi")

const validateUserInput = async (req, res, next)=>{
    try{
        const userSchema = await joi.object({
            first_name:joi.string().required(),
            last_name:joi.string().required(),
            email:joi.string().required(),
            password:joi.string().required().min(8),
            phoneNum:joi.string()
        })

        userSchema.validate(req.body)

        next()

    }catch(err){
        res.json({
            error:err.message
        })
    }
}


const validateLoginInput = async (req, res, next)=>{
    try{
        const userSchema = await joi.object({
            email:joi.string().required(),
            password:joi.string().required().min(8),
        })

        userSchema.validate(req.body)

        next()

    }catch(err){
        res.json({
            error:err.message
        })
    }
}

module.exports = {validateUserInput, validateLoginInput}