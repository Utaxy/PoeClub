import express from 'express';
import pool from '../database/db.js';


const router = express.Router();

router.post('/api/google-login',async(req, res)=>{
    try {
        const {googleId} = req.body;
        const userQuery = await pool.query('SELECT alias, picture, isadmin FROM users WHERE google_id= $1',[googleId]);
        if(userQuery.rows.length>0){
            const user = userQuery.rows[0]
            res.status(200).json({
                success:true,
                alias:user.alias,
                picture:user.picture,
                admin:user.isadmin
            });
        }else{
            res.status(404).json({
                success:false,
                message:'User not found.'
            })
        }
    } catch (error) {
        console.error(error,'Database Error');
        res.status(500).json({message:'Database error' + error.message})
    }
})


export default router;