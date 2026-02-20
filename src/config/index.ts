import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
// here i am saying take the current folder and add the .env file inside that folder and load the environment variable from there . 

const config = {
  connection_str: process.env.CONNECTION_STRING,
  port:process.env.PORT,
 
};

export default config;