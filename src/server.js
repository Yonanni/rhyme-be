import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from 'mongoose'
import blogsRouter from "./services/blogs/index.js"
import authorsRouter from "./services/authors/index.js"
import {badRequestErrorHandler, catchAllErrorHandler, notFoundErrorHandler} from './errorHandlers.js'
import cors from "cors";
import passport from "passport"
import GoogleStrategy from "./tools/oauth.js"
import cookieParser from "cookie-parser"

const server = express()

const port = process.env.PORT || 3003 || 3000

passport.use("google", GoogleStrategy)

// ******************** MIDDLEWARES ******************
server.use(cors());

server.use(express.json())
server.use(cookieParser())
server.use(passport.initialize())
// ******************* ROUTES ***********************

server.use("/blogPosts", blogsRouter)
server.use("/authors", authorsRouter)


// ******************* ERROR HANDLERS ******************

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)


mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log('Successfully connected to mongo!')
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("Server is running on port ", port)
  })
})

mongoose.connection.on("error", err => {
  console.log("MONGO ERROR: ", err)
})
