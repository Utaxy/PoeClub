import express from 'express';
import pool from '../database/db.js';


const router = express.Router();



router.get('/api/messages',async(req, res)=>{
    try {
        const showMessage = await pool.query('SELECT id, alias, message, picture, created_at, likes FROM messages ORDER BY created_at DESC');
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

router.post('/api/messages/likes', async(req, res)=>{
    try {
        const {messageId, userId} = req.body;

        if(!messageId || !userId){
            return res.status(400).json({
                success:false,
                message:'Message id  or user id is required'
            })
        };
        const existingLike = await pool.query('SELECT id FROM message_likes WHERE message_id=$1 AND user_alias=$2',[messageId, userId]);
        if(existingLike.rows.length >0){
            return res.status(400).json({
                success:false,
                message: 'You already liked this message'
            })
        }
        await pool.query(
            'INSERT INTO message_likes (message_id, user_alias) VALUES($1,$2)',[messageId, userId]
        );

        const updateResult = await pool.query('UPDATE messages SET likes = likes + 1 WHERE id=$1 RETURNING likes',[messageId]);

        if(updateResult.rows.length===0){
            return res.status(404).json({
                success:false,
                message:'Message not found'
            })
        };
        res.json({
            success:true,
            message:'Like added successfully',
            LikeCount: updateResult.rows[0].likes
        });
        
    } catch (error) {
        console.error('like error', error);
        res.status(500).json({
            success:false,
            message:'Database error' + error.message
        })
    }
});

router.post('/api/messages/comments',async(req, res)=>{
    try {
        const {comment,userId, messageId} = req.body;
        const doesUserExist = await pool.query('SELECT alias FROM users WHERE alias=$1',[userId]);
        if(doesUserExist.rows.length === 0 ){
            return res.status(404).json({
                success:false,
                message:'User not found'
            })
        };
        
        const doesMessageExist = await pool.query('SELECT id FROM messages WHERE id=$1',[messageId]);
        if(doesMessageExist.rows.length===0){
            return res.status(404).json({
                success:false,
                message:'Message not found'
            });
        };
        if(!comment){
            return res.status(404).json({
                success:false,
                message:'You need to write a comment'
            });
        };
        const userProfilePicture = await pool.query('SELECT picture FROM users WHERE alias=$1',[userId])
        const userPp = userProfilePicture.rows[0].picture
        const registeredComment=await pool.query('INSERT INTO message_comments (comment, user_alias, message_id, picture) VALUES($1,$2,$3,$4) RETURNING *',[comment,userId,messageId,userPp]);
        res.status(202).json({
            success:true,
            data:registeredComment.rows[0]
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success:false,
            message:'Database error',
            error:error.message
        })
    }
})

router.get('/api/messages/comments',async(req, res)=>{
    try {
        const showComments = await pool.query('SELECT message_id, user_alias, comment, created_at,picture FROM message_comments ORDER BY created_at DESC') 
        
        res.status(200).json({
            success:true,
            data:showComments.rows
        })
    } catch (error) {
        console.error('database error: ',error)
        res.status(500).json({
            success:false,
            message:'Failed to fetch comments', error
        })
    }
})


export default router;
