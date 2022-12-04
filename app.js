const express = require("express");
const path = require("path");
const app = express();
// const static = express.static(__dirname + '/public');
const publicPath = path.resolve(__dirname, "public");
const exphbs = require("express-handlebars");
const session = require("express-session");
const configRoutes = require("./routes");

// app.use("/public", static); // when url has public in it, use static html page
app.use(express.static(publicPath));

app.use(express.json()); //middleware
app.use(express.urlencoded({ extended: true })); // another middleware

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" })); //look for the template in views directory - layouts
app.set("view engine", "handlebars");

app.use(
    session({
        name: 'EntrepotAuthCookie',
        secret: 'This is a secret string!',
        resave: false,
        saveUninitialized: true,
    })
)

app.use('/user', (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).redirect('/login');
    }else {
        next();
    }
})

app.use('/review', (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).redirect('/login');
    }else {
        next();
    }
})

app.use('/products', (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).redirect('/login');
    }else {
        next();
    }
})

app.use('/user/update', (req, res, next) => {
    if (req.method && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    next();
})

configRoutes(app);


app.listen(3001, (req, res) => {
    console.log('Now we got a server');
    console.log('Your routes will be running on http://localhost:3001');
})

