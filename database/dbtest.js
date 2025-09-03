import pool from "./db.js";

pool.connect()
    .then(()=>console.log('database bagli'))
    .catch(err=>console.error('database connection error',err))
    