const mongoose = require ("mongoose")
const {DateTime} = require ("luxon")

const Schema = mongoose.Schema

const blogSchema = new Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    blogBody:{type:String, required:true},
    published_date:{type:String},
    created_date:{type:String, required:true, default:DateTime.now().toFormat("LLL d, yyyy \'at\' HH:mm")},
    tag:{type:String, required:true},
    author:{type:String, required:true},
    read_count:{type:Number, required:true, default:0},
    reading_time:{type:String, required:true},
    state:{type:String, required:true, default:"draft", enum:["draft", "published"]},
    userId:{type:Schema.Types.ObjectId, ref:"users"}
})


module.exports = mongoose.model("blogs", blogSchema)