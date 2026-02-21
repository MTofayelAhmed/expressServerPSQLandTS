import express from "express"
import { todoController } from "./todo.controller"

const Router = express.Router()

Router.post("/", todoController.createTodo)




export const todoRouter = Router
