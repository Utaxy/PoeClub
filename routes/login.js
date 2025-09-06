import express from 'express';
import pool from '../database/db.js';
import bcrypt from 'bcrypt'

const router = express.Router();


router.post('/api/login',async (req, res)=>{
    try {
        const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json({success:false, message:'Missing credentials'});
    }

    const result = await pool.query('SELECT id, username, password, alias FROM users WHERE username =$1',[username]);
    if(result.rowCount===0){
        return res.status(400).json({success:false, message:'Invalid username or password'});
    }
    const user= result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.status(401).json({success:false, message:'Invalid username or password'});
    }
    const successfullLogin = {id:user.id, username:user.username, alias:user.alias}
    return res.status(200).json({success:true, safeUser: successfullLogin})
    } catch (error) {
        console.error('login error:', error);
        return res.status(500).json({success:false, message:'Server error'});
    }
})



export default router;