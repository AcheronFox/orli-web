import dotenv from "dotenv"
dotenv.config()
import * as mysql from "mysql";

const sqlConfig = {
    connectionLimit : 20,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE
}

const database = mysql.createPool(sqlConfig)

export default database;