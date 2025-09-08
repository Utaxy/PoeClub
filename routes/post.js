import express from 'express';
import pool from '../database/db.js'
import requireAuth from '../middlewares/sessioncheck.js';

const router = express.Router();



router.post('/api/post',requireAuth,async (req, res)=>{
    try {
        const {post} = req.body;
        const userAlias = req.user.alias;

        const userPost = await pool.query(
            'INSERT INTO messages (message, alias) VALUES ($1, $2) RETURNING *',
            [post, userAlias]
        );
        res.status(201).json({
            success:true,
            data:userPost.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:'Database error',
            error:error.message
        })
    }
});


export default router;