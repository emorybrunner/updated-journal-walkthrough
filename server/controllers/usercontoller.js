const router = require('express').Router(); //combining import and router method access
const { UserModel } = require('../models');
//*THIS IS IMPORTANT
const { UniqueConstraintError } = require('sequelize/lib/errors'); //deleted sequelize/types requirement for this -- but where did that even come from...?
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');




router.post('/register', async (req, res) => {
    let { email, password } = req.body.user; //object destructuring ensures that req.body.user is applied to both email and password. so, email = req.body.user.email => 9.2.3(B) in modules

    /*
    The actual request looks like this :

    'req': {
        'body': {
            'user': {
                'email':
                'password':
            }
        }
    }

    */
    try {
        const User = await UserModel.create({ //create an instance of the user model via sequelize and send it to the DB
            //AWAIT here is what prevents the unique constraint error by preventing the return unless the model entry has been created
            email, //this is shorthand for email: email aka email: req.body.user.email
            password : bcrypt.hashSync(password, 13)
        });

        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 }); //jwt.sign is used to create the token, so you can add whatever you'd like to it -- but you should never put sensitive information that could identify a user in it. it takes at least 2 parameters: the payload and the signature

        res.status(201).json({
            message: 'User successfully registered.',
            user: User, 
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) { //checking for the type of error
            res.status(409).json({
                message: 'Email already in use.'
            });
        } else {
            res.status(500).json({
                message: 'Failed to register user.'
            });
        }
    }
});

router.post('/login', async (req, res) => {
    let { email, password } = req.body.user;

    try {
        const loginUser = await UserModel.findOne ({ //findOne is a sequelize method that performs Data Retrieval, in this case looking at the UserModel
            where: { //where is an object in sequelize that tells the database to look for matching entries
                email: email
            }
        });
        if (loginUser) { //checking for if the loginUser response is a truthy value (if not, it returns null, which is not an error but IS a falsey value)
            let passwordComparison = await bcrypt.compare(password, loginUser.password);
            if (passwordComparison) {

                let loginToken = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                res.status(200).json({
                    user: loginUser,
                    message: 'User successfully logged in',
                    sessionToken: loginToken
                }); 
            } else {
                res.status(401).json({
                    message: 'Incorrect email or password'
                });
            }
        } else {
            res.status(401).json({
                error: 'Incorrect email or password'
            });
        }
    } catch {
        res.status(500).json({
            message: 'User login failed'
        });
    };
});

module.exports = router;