import * as mysql from "mysql";

const sqlConfig = {
    connectionLimit : 20,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    timezone: "+00:00"
}

const database = mysql.createPool(sqlConfig)

export default database;