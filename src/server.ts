import express, { NextFunction, Request, Response }  from 'express'
import {Pool} from "pg"
import dotenv from 'dotenv'
import path from "path"

dotenv.config({path: path.join(process.cwd(), ".env")})
const app = express()
const port = 5000

// parser to parse the incoming requests with JSON payloads
app.use(express.json())
// to send formdata
app.use(express.urlencoded())

// create connection pool 
const pool = new Pool({
connectionString:  `${process.env.CONNECTION_STRING}`
})


const initDb = async ( )=> {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INT,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`
)

await pool.query(`CREATE TABLE IF NOT EXISTS todos(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )`)

}
initDb()

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} [${new Date().toISOString()}] \n`)
  next()
}



app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello Next level Developer!')
})
// users crud operations



app.post("/users", async (req: Request, res: Response) => {
    
const {name, email}= req.body

try {
  const result = await pool.query(`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`, [name, email])
    console.log(result.rows[0])

    res.status(201).json({ success: true, message: "User inserted successfully", data: result.rows[0] })

} catch (error : any) {
    res.status(500).json({ success: false, message: error.message });
}

});
app.get("/users", async(req: Request, res: Response)=>{
    try {
        const result = await pool.query(`SELECT * FROM users`)
        res.status(200).json({ success: true, data: result.rows })
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message, details: error });
    }
})

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
