
const mongoose = require ("mongoose")
// const bcrypt = require("bcrypt")

const Schema = mongoose.Schema

const userSchema = new Schema({
    first_name:{type:String, required:true},
    last_name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    phoneNum:{type:String},
})

// userSchema.pre("save", async function(next){
//     const hashedPassword = await bcrypt.hash(this.password, 10) 
//     this.password = hashedPassword
//     next()
// })

module.exports = mongoose.model("users", userSchema)