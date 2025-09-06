import express from 'express';
import pool from '../database/db.js'

const router = express.Router();



router.post('/api/post',async (req, res)=>{
    try {
        const {post} = req.body;

        const userPost = await pool.query(
            'INSERT INTO messages (message) VALUES ($1) RETURNING *',
            [post]
        );
        res.status(201).json(userPost.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Database error'},error)
    }
})