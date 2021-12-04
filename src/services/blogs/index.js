import express from 'express'
import createError from 'http-errors'
import BlogModel from './schema.js'
import multer from 'multer';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary} from 'cloudinary'
import authJwt from '../../tools/authJwt.js'

export const cloudinaryStorageMedia = new CloudinaryStorage({
  cloudinary,
  params:{
      folder: "Blog-images",
  },
})


const blogsRouter = express.Router()
// cover image
blogsRouter.put("/coverUpdate/:postId",multer({ storage: cloudinaryStorageMedia }).single("cover"), async(req,res,next) => {
  try {
   const blogId = req.params.postId
   if(req.file.path===""){
    req.file.path="https://res.cloudinary.com/djm1hfijq/image/upload/v1630601514/Blog-images/No_image_3x4.svg_lozryx.png"
  }
   const modifiedBlog = await BlogModel.findByIdAndUpdate(blogId,{
    ...req.body,
    cover: req.file.path
   }, {
    new: true // returns the modified blog
  })

    res.status(201).send({modifiedBlog})
    
  } catch (error) {
    next(error)
  }
})
//post article
blogsRouter.post("/", async(req,res,next) => {
  try {
    const newBlog = new BlogModel(req.body) 
    const {_id} = await newBlog.save()

    res.status(201).send({_id})
    
  } catch (error) {
    next(error)
  }
})


//all articles
blogsRouter.get("/", async(req,res,next) => {
  try {
    
    const blogPosts = await BlogModel.find({}).populate('author')

    res.send(blogPosts)
    
  } catch (error) {
    next(error)
  }
})
//single article
blogsRouter.get("/:blogId", async(req,res,next) => {
  try {

    const blogId = req.params.blogId

    const blogPosts = await BlogModel.findById(blogId).populate('author') // similar to findOne()

    if(blogPosts){

      res.send(blogPosts)

    } else {
      next(createError(404, `Blog with id ${blogId} not found!`))
    }
    
  } catch (error) {
    next(error)
  }
})
//my articles
blogsRouter.get("/me/:authorId", async(req,res,next) => {
  try {

    const authorId = req.params.authorId

    const blogPosts = await BlogModel.find({ "author": authorId }).populate('author') // similar to findOne()

    if(blogPosts){

      res.send(blogPosts)

    } else {
      next(createError(404, `Blog with id ${blogId} not found!`))
    }
    
  } catch (error) {
    next(error)
  }
})

//update article
blogsRouter.put("/:blogId",[authJwt.verifyToken], async(req,res,next) => {
  try {
    const blogId = req.params.blogId

    const modifiedBlog = await BlogModel.findByIdAndUpdate(blogId, req.body, {
      new: true // returns the modified blog
    })

    if(modifiedBlog){
      res.status(202).send(modifiedBlog)
    } else {
      next(createError(404, `User with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

//delete article
blogsRouter.delete("/:blogId",[authJwt.verifyToken], async(req,res,next) => {
  try {
    const blogId = req.params.blogId

    const deletedBlog = await BlogModel.findByIdAndDelete(blogId)

    if(deletedBlog){
      res.status(204).send()
    } else {
      next(createError(404, `User with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})





export default blogsRouter