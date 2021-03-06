require('dotenv').config(); //MUST be at top of file
const Express = require('express');
const app = Express(); //creating an instance of express called app by firing off the top level express function from the express modules
const dbConnection = require('./db');

//CommonJS formatting
const controllers = require('./controllers');

//*PLACEMENT IS KEY -- ENDPOINTS
/*
endpoints need to be between the imports and the app.listen
app.use(endpoint, callback fxn)

app.use(`/test`, (req, res) => {
    res.send(`Test endpoint success`)
})
*/

app.use(Express.json()) //this allows us to use the req.body middleware via the express.json() function

//app.use(require('./middleware/validate-jwt')); 
//anything beneath validateJWT is protected as it requires a token to access -- but we want people to be able to be able to view others' journals! so, lets move it to the specific functions we want protected

app.use('/journal', controllers.journalController); // --> CommonJS format (controllers.journalController)
//this creates a base URL for all requests in the journalcontroller
/* ie http://localhost:3000/journal/practice */
app.use('/user', controllers.userController);

dbConnection.authenticate()
    .then(() => dbConnection.sync()) //sync all of the models to the database
    .then(() => { //moving the socket declaration so that it runs after the database connection is authenticated
        app.listen(3000, () => {
            console.log(`[server]: App is listening on port 3000`);
        });
    })
    .catch((err) => {
        console.log(`[server]: Server crashed. Error = ${err}`);
    });

//start a UNIX socket to listen for connections on the given path (localhost:3000; 3000 is a parameter)
// app.listen(3000, function(){
//     console.log(`[server]: App is listening on port 3000`);
// });