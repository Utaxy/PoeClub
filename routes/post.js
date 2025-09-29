import express from 'express';
import pool from '../database/db.js'
import requireAuth from '../middlewares/sessioncheck.js';

const router = express.Router();



router.post('/api/post',requireAuth,async (req, res)=>{
    try {
        const {post, imgUrl} = req.body;
        const userAlias = req.user.alias;

        const userFindPicture = await pool.query('SELECT picture FROM users WHERE alias=$1',[userAlias]);
        if(userFindPicture.rows.length===0){
            return res.status(404).json({
                success:false,
                message:'User not found'
            });
        };
        const userPicture = userFindPicture.rows[0].picture;
        const userPost = await pool.query('INSERT INTO messages (message, alias, picture, postimg) VALUES($1,$2,$3,$4)',[post,userAlias,userPicture,imgUrl]);
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