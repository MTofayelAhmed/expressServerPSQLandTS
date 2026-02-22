import { Request, Response } from "express"
import { pool } from "../../config/db"
import { userService } from "./user.service"

 const createUser = async (req: Request, res: Response) => {
    


try {
  const result = await userService.createUser(req.body)

    res.status(201).json({ success: true, message: "User inserted successfully", data: result.rows[0] })

} catch (error : any) {
    res.status(500).json({ success: false, message: error.message });
}

}


const getUser = async(req: Request, res: Response)=>{
    try {
        const result = await  userService.getUser()
        res.status(200).json({ success: true, data: result.rows })
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message, details: error });
    }
}



const getUserById = async (req: Request, res: Response)=>{
    try {
        const result = await userService.getSingleUser(req.params.id as string)
        if(result.rows.length === 0){
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, data: result.rows[0] })
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message, details: error });
    }

}


const updateUser =  async (req: Request, res: Response)=>{
    const {name, email} = req.body 
    try {
        const result = await userService.updateUser(name, email, req.params.id as string)
        if(result.rows.length === 0){
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, message: "User updated successfully", data: result.rows[0] })
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message, details: error });
    }
}


const deleteUser = async (req: Request, res: Response)=>{
    try {
        const result = await pool.query(`DELETE FROM users WHERE id = $1 `, [req.params.id])
        if(result.rowCount === 0){
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, data: null, message: "User deleted successfully" })
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message, details: error });
    }

} 

export const userController = {
    createUser, getUser, getUserById, updateUser, deleteUser
}