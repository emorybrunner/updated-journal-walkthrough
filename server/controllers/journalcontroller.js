let Express = require('express');
let router = Express.Router();
//Router() method returns a router object; this enables us to use HTTP methods (like get, put, post, delete, etc)

router.get('/about', (req, res) => {
    res.send('About endpoint success')
})

/* PRACTICE ROUTE
router.get('/practice', (req, res) => {
    res.send('Practice endpoint success.')
})
*/

module.exports = router