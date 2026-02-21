import express, { Request, Response } from 'express'
import { pool } from '../../config/db'
import { userController } from './user.controller'

const Router = express.Router()


// app.use("/users", userRouter)

// routes => controller => service

Router.post("/", userController.createUser)

Router.get("/:id", userController.getUserById)
Router.put("/:id", userController.updateUser)
Router.delete("/:id", userController.deleteUser)

export const userRouter = Router