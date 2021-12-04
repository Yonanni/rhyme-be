import mongoose from 'mongoose'

const {Schema, model} = mongoose

const authorSchema = new Schema({
    name: {type:String, required: true},
    email: {type:String, required: true, match: /.+\@.+\..+/, unique: true},
    password: {type:String},
    role: {type:Number, required: true}, //1-ADMIN, 2-AUTHORS
    avatar: {type:String, required: true},
    googleId:{type:String}
    }, {
        timestamps: true
    })

export default model("authors", authorSchema) // bounded to the "users" collection, if it is not there it is going to be created automatically