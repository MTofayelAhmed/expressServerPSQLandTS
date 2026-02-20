import express from 'express'
import type { NextFunction, Request, Response } from 'express'

import config from './config'
import initDb, { pool } from './config/db'
import logger from './middleware/logger'
import { userRouter } from './modules/user/user.routes'



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



// app.post("/users", async (req: Request, res: Response) => {
    
// const {name, email}= req.body

// try {
//   const result = await pool.query(`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`, [name, email])
//     console.log(result.rows[0])

//     res.status(201).json({ success: true, message: "User inserted successfully", data: result.rows[0] })

// } catch (error : any) {
//     res.status(500).json({ success: false, message: error.message });
// }

// });



app.use("/users", userRouter)



// app.get("/users", async(req: Request, res: Response)=>{
//     try {
//         const result = await pool.query(`SELECT * FROM users`)
//         res.status(200).json({ success: true, data: result.rows })
//     } catch (error : any) {
//         res.status(500).json({ success: false, message: error.message, details: error });
//     }
// })

// get users by id 





app.get("/users/:id", async (req: Request, res: Response)=>{
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id])
        if(result.rows.length === 0){
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, data: result.rows[0] })
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message, details: error });
    }

})

// update user by id 

app.put("/users/:id", async (req: Request, res: Response)=>{
    const {name, email} = req.body 
    try {
        const result = await pool.query(`UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`, [name, email, req.params.id])
        if(result.rows.length === 0){
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, message: "User updated successfully", data: result.rows[0] })
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message, details: error });
    }
})

// delete user by id 

app.delete("/users/:id", async (req: Request, res: Response)=>{
    try {
        const result = await pool.query(`DELETE FROM users WHERE id = $1 `, [req.params.id])
        if(result.rowCount === 0){
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, data: null, message: "User deleted successfully" })
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message, details: error });
    }

})


// todos crud operations
app.post("/todos", async (req: Request, res: Response) => {
    
    const {user_id, title}= req.body
    try {
      const result = await pool.query(`INSERT INTO todos (user_id, title) VALUES($1, $2) RETURNING *`, [user_id, title])
      res.status(201).json({ success: true, message: "Todo inserted successfully", data: result.rows[0] })
    } catch (error : any) {
      res.status(500).json({ success: false, message: error.message });
    }
})

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
