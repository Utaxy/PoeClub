import express from 'express';
import pool from '../database/db.js';
const router = express.Router();


router.post('/api/google-register',async(req, res)=>{
    try {
        const {email, name, picture, googleId, alias} = req.body;
        const existingUser = await pool.query('SELECT * FROM users WHERE google_id= $1 AND email=$2',[googleId, email]);
        if(existingUser.rows.length > 0){
            return res.status(400).json({message:'This user is already exist'});
            
        }
        const existingAlias = await pool.query('SELECT * FROM users WHERE alias=$1',[alias]);
        if(existingAlias.rows.length > 0){
            res.status(400).json({message:'This alias is already taken by another user. Please change it.'});
            return;
        }

        const registerNewUser = await pool.query('INSERT INTO users(email, name, picture, google_id, alias, created_at) VALUES($1, $2, $3, $4, $5, NOW()) RETURNING id, email, name, alias, picture',
            [email, name, picture, googleId, alias]
        );
        const newUser = registerNewUser.rows[0];
        res.status(200).json({
            success:true,
            message:'Successfully registered',
            email:newUser.email,
            picture:newUser.picture,
            alias:newUser.alias
        });
        
    } catch (error) {
        console.error('Google registration failed', error);
        res.status(500).json(error,{message:'Server error'});
    }
 })

export default router;
