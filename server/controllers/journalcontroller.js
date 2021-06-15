let Express = require('express');
let router = Express.Router();
//Router() method returns a router object; this enables us to use HTTP methods (like get, put, post, delete, etc)
let validateJWT = require('../middleware/validate-jwt');

router.get('/about', (req, res) => {
    res.send('About endpoint success')
})

//PRACTICE ROUTE
router.get('/practice', validateJWT, (req, res) => { //now we cant access the practice route without a valid token
    res.send('Practice endpoint success.')
})


module.exports = router