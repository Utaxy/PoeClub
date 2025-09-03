import express from 'express';
import pool from '../database/db.js';
import bcrypt from 'bcrypt';

const router = express.Router();


router.post('/api/register',async(req, res)=>{
    try {
        const {username, password, alias} = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const newUser = await pool.query(
            'INSERT INTO users(username, password, alias) VALUES($1, $2, $3) RETURNING username, alias',
            [username, hashedPassword, alias]
        );
        res.json({
            succes:true,
            user: newUser.rows[0]
        })
    } catch (error) {
        res.status(500).json({error:'Registration failed'})
    }
});

export default router;