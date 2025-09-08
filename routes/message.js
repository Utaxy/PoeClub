import express from 'express';
import pool from '../database/db.js';


const router = express.Router();



router.get('/api/messages',async(req, res)=>{
    try {
        const showMessage = await pool.query('SELECT alias, message, created_at FROM messages ORDER BY created_at DESC');
        res.status(200).json({
            success: true,
            data:showMessage.rows
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success:false,
            message:'Failed to fetch messages',
            error: error.message
        })
    }
});



export default router;