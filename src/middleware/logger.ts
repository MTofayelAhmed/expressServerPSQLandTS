import { NextFunction, Response } from "express"
import path from "path"
// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method}  [${new Date().toISOString()}] \n`)
  next()
}


export default logger;