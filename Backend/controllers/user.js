const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Sign Up (new user) Controller
exports.signUp = (req, res, next) =>{
    //The request's body password is being salted 10 times before being passed
    bcrypt.hash(req.body.password, 10).then((hash) =>{
        const user = new User ({
            email: req.body.email,
            password: hash
        });
        //Saving new user login information
        user.save().then(() =>{
            res.status(201).json({
                message: 'User added successfully'
            })
        });
    }).catch((error) =>{
        res.status(500).json({
            error: error
        })
    });
}

//Login (existing user) Controller
exports.login = (req, res, next) =>{
    User.findOne({email: req.body.email}).then(
        (user) =>{
            //User existence check
            if(!user) {
                return res.status(401).json({
                    error: new Error('User not found!')
                });
            }; //end of User existence check
            //Comparison of User input (password) against the hashed password within the database
            bcrypt.compare(req.body.password, user.password).then(
                (valid) =>{
                    //Password validity check
                    if(!valid){
                        return res.status(401).json({
                            error: new Error('Incorrect Password')
                        });
                    }; //end of validity check
                    //Authentication token creation
                    const token = jwt.sign(
                        {userId: user._id},
                        process.env.JWT_CIPHER,
                        {expiresIn: '24h'}
                    );
                    //respond with userId/ObjectId from MongoDB Atlus both inside and outside of the token
                    res.status(201).json({
                        userId: user._id,
                        token: token
                    })
            }).catch((error) =>{
                res.status(500).json({
                    error: error
                })
            });
        }
    ).catch((error) =>{
        res.status(500).json({
            error: error
        });
    })
}