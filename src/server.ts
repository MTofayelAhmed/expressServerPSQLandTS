import express from 'express'
import type { NextFunction, Request, Response } from 'express'

import config from './config'
import initDb, { pool } from './config/db'
import logger from './middleware/logger'
import { userRouter } from './modules/user/user.routes'
import { userController } from './modules/user/user.controller'
import { todoRouter } from './modules/todo/todo.routes'



const app = express()
const port = config.port

// parser to parse  incoming requests with JSON payloads
app.use(express.json())
// to send formdata
app.use(express.urlencoded())


// initializing DB

initDb()





app.get('/', (req: Request, res: Response) => {
  res.send('Hello Next level Developer!')
})
// users crud operations


app.use("/users", userRouter )










// delete user by id 




// todos crud operations

app.use("/todos", todoRouter)




app.get("/todos", async(req: Request, res: Response)=>{
    try {
        const result = await pool.query(`SELECT * FROM todos`)
        res.status(200).json({ success: true, data: result.rows })
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message, details: error });
    }
})

// adding 404 not found route 
app.use((req: Request, res: Response)=>{
    res.status(404).json({ success: false, message: "Route not found" })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
