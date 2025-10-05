import express from 'express';
import pool from '../database/db.js'

const requireAuth = async(req, res ,next)=>{
    try {
        const alias = req.headers['x-user-alias'];
        if(!alias){
            return res.status(401).json({
                success:false,
                message:'Please log in first'
            })
        }

        const userExist = await pool.query('SELECT id, alias, isadmin FROM users WHERE alias=$1',[alias])
        if(userExist.rowCount===0){
            return res.status(401).json({
                success:false,
                message:'User not found'
            })
        }
        const {id, alias:userAlias , isadmin} = userExist.rows[0];
        req.user = {id ,alias:userAlias, isAdmin: isadmin===true};
        return next();
    } catch (error) {
        console.error('Middleware error',error);
        return res.status(500).json({
            success:false,
            message:'Database error'
        })
    }
};
export const requireAdmin = (req, res, next)=>{
    if(!req.user || !req.user.isAdmin){
        return res.status(403).json({
            success:false,
            message:'Admin access required'
        })
    }
    return next()
};

export default requireAuth;

