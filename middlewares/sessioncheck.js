import express from 'express';

const requireAuth = (req, res ,next)=>{
    const userAlias = req.headers['x-user-alias'];

    if(!userAlias){
        return res.status(401).json({
            success:false,
            message: 'Authentication required. Please login first.'
        });
    }
    req.user = {alias:userAlias};
    next();
};

export default requireAuth;

