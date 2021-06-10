const router = require('express').Router(); //combining import and router method access
//*THIS IS IMPORTANT
const { UniqueConstraintError } = require('sequelize/lib/errors'); //deleted sequelize/types requirement for this -- but where did that even come from...?

const { UserModel } = require('../models');
const User = require('../models/user');



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
            email,
            password
        });

        res.status(201).json({
            message: 'User successfully registered.',
            user: User
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
            res.status(200).json({
                user: loginUser,
                message: 'User successfully logged in'
            });
        } else {
            res.status(401).json({
                error: 'Login Failed'
            });
        }
    } catch {
        res.status(500).json({
            message: 'User login failed'
        });
    };
});

module.exports = router;