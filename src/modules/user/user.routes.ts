import express, { Request, Response } from 'express'
import { pool } from '../../config/db'
import { userController } from './user.controller'

const Router = express.Router()


// app.use("/users", userRouter)

// routes => controller => service

Router.post("/", userController.createUser)

Router.get("/", async(req: Request, res: Response)=>{
    try {
        const result = await pool.query(`SELECT * FROM users`)
        res.status(200).json({ success: true, data: result.rows })
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message, details: error });
    }
})


export const userRouter = Router