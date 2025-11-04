const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = (req, res, next) =>{
    try{
        const authHeader = req.headers.authorization;
        //Authorization Header check
        if(!authHeader) {
            return res.status(401).json({error: 'No Authorization Header provided!'})
        }

        const authParts = authHeader.split(' ');
        //Authorization Header format check
        if(authParts.length !== 2 || authParts[0] !== "Bearer") {
            return res.status(401).json({error: 'Invalid Authorization Header format'});
        }
        const token = authParts[1];
        const decodedToken = jwt.verify(token, process.env.JWT_CIPHER);
        //If an invalid or malformed token comes into play it will be denied 
        if(!decodedToken || !mongoose.Types.ObjectId.isValid(decodedToken.userId)){
            return res.status(401).json({
                error: '❌ Invalid user ID in token'
            })
        }

        req.auth = {userId: decodedToken.userId}

        next();

    } catch(error){
        let message = 'Unauthorized access!'
        if(error.name === 'TokenExpiredError'){
            message = 'Token has expired';
        } else if(error.name === 'JsonWebTokenError'){
            message = 'Invalid token';
        }
        res.status(401).json({
            error: message
        })
    }
}