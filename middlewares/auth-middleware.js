const jwt = require('jsonwebtoken');
const userModel = require('../app/models/userModel');

const isAuthenticae = async (req,res,next) => {
    let token;
    const {authorization} = req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        try {
            //Get Token from Header
            token = authorization.split(' ')[1];
            //Verify Token
            const user = jwt.verify(token,process.env.JWT_SECCRET);
            //Get user from Token
            req.user = await userModel.findById(user.userId).select('-password');
            next();
        } catch (error) {
            console.log('Middleware Error',error);
            res.status(401).send({"status":"failed","message":"Unauthorized user"});
        }
    }
    if(!token){
        res.status(401).send({"status":"failed","message":"Unauthorized user, No Token"});
    }
}

module.exports = isAuthenticae