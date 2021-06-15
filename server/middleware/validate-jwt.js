const jwt = require('jsonwebtoken');
const { UserModel } = require('../models'); //need user model because we need to find more information about our user

const validateJWT = async (req, res, next) => {
    if (req.method == 'OPTIONS') { //OPTIONS is an http request method that is the first part of the preflight request
        next(); //next is a middleware function that is part of express
    } else if (
        req.headers.authorization && 
        req.headers.authorization.includes('Bearer') //authorization header must include Bearer
    ) {
        const { authorization } = req.headers;
            //console.log('authorization --> ', authorization)
        const payload = authorization //if the authorization header has a truthy value, decode the token using the JWT verify middleware, which will split it into its parts. If not, return undefined as the payload 
            ? jwt.verify(
                authorization.includes('Bearer') //if the token includes Bearer
                    ?  authorization.split(' ')[1] //split it at the first space (so we only have the token)
                    : authorization, 
                process.env.JWT_SECRET 
            ) 
            : undefined;

        //console.log('payload --> ', payload)

        if (payload) { //if our payload variable has a value
            let foundUser = await UserModel.findOne({ where: { id: payload.id } }); //find a user where the value of its id is the same as the id we decoded in the payload
            console.log('foundUser --> ', foundUser)

            if (foundUser) {
                //console.log('request --> ', req)
                req.user = foundUser; //this allows us to store all of the information that we got from the database for the user with the token's id (email, pw, etc) in a new property of the express request object that we called user
                next();
            } else {
                res.status(400).send({ message: 'Not Authorized' });
            }
        } else {
            res.status(401).send({ message: 'Invalid Token' });
        } 
    } else {
        res.status(403).send({ message: 'Forbidden' });
    }
};

module.exports = validateJWT