import mongoose from 'mongoose'

const {Schema, model} = mongoose

const blogSchema = new Schema({
    category : {type: String, required: true},
    title : {type: String, required: true},
    cover : {type: String, required: false},
    readTime : {
        value: {type:Number, required: false},
        unit: {type:String, required: false}
    },
    author : { type: Schema.Types.ObjectId, ref: "authors", required: true },
    content: {type:String, required: true},
    
    }, {
        timestamps: true
    })

export default model("blogPost", blogSchema) // bounded to the "users" collection, if it is not there it is going to be created automatically