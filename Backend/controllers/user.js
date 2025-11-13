const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
//Sign Up (new user) Controller
exports.signUp = async (req, res, next) =>{

    try {
        //The request's body password is being salted 10 times before passing--
            // --the hashed password to be saved
       const hashPW = await bcrypt.hash(req.body.password, 10);
       const user = new User({
        email: req.body.email,
        password: hashPW
       });
       await user.save();
       res.status(201).json({message: '✅New User created successfully!'})

    } catch (error) {
        //duplicate email error
        if(error.code === 11000){
            return res.status(400).json({error: 'User email already exists'})
        };
        //If the email can't be validated
        if(error.name === 'ValidationError'){
            return res.status(400).json({error: '❌Invalid user data provided'})
        };

        //fallback internal server error
        res.status(500).json({error: 'Internal server error'})
    }
    
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