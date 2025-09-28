import express from 'express';
import pool from '../database/db.js'
const router = express.Router();



router.post('/api/usermessages',async(req, res)=>{
  const {alias} = req.body;
  try{
    const usersMessages = await pool.query('SELECT * FROM messages WHERE alias=$1 ORDER BY created_at DESC',[alias])
    if(usersMessages.rows.length===0){
      return res.status(404).json({
        success:false,
        message:'You done have any post yet'
      })
    }
    const data = usersMessages.rows
    res.status(200).json({
      success:true,
      data:data
    })
    console.log(data);
  }
  catch(error){
    console.error('Database error:', error)
    res.status(500).json({
      success:false,
      message:'Database error',error
    })
  }
})

export default router;
