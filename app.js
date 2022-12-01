const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const exphbs = require('express-handlebars');
const session = require('express-session');
const configRoutes = require('./routes');


app.use('/public', static); // when url has public in it, use static html page
app.use(express.json());    //middleware
app.use(express.urlencoded({extended: true}));  // another middleware

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'})); //look for the template in views directory - layouts
app.set('view engine', 'handlebars');

app.use(
    session({
        name: 'entrepotUser',
        secret: 'This is a secret string!',
        resave: false,
        saveUninitialized: true,
    })
)







configRoutes(app);


app.listen(3000, (req, res) => {
    console.log('Now we got a server');
    console.log('Your routes will be running on http://localhost:3000');
})

