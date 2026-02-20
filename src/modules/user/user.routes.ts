import express, { Request, Response } from 'express'
import { pool } from '../../config/db'

const Router = express.Router()

Router.post("/",  async (req: Request, res: Response) => {
    
const {name, email}= req.body

try {
  const result = await pool.query(`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`, [name, email])
    console.log(result.rows[0])

    res.status(201).json({ success: true, message: "User inserted successfully", data: result.rows[0] })

} catch (error : any) {
    res.status(500).json({ success: false, message: error.message });
}

})

Router.get("/", async(req: Request, res: Response)=>{
    try {
        const result = await pool.query(`SELECT * FROM users`)
        res.status(200).json({ success: true, data: result.rows })
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message, details: error });
    }
})


export const userRouter = Router