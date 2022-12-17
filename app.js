const express = require("express");
const app = express();
const session = require("express-session");
const exphbs = require("express-handlebars");
const configRoutes = require("./routes");

const Handlebars = require("handlebars");


const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === 'number')
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new Handlebars.SafeString(JSON.stringify(obj));
        }
    },
    partialsDir: ['views/partials/']
});


app.use('/public', express.static(__dirname + '/public'));
// app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebarsInstance.engine);
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
        return res.status(403).redirect('/');
    }else {
        next();
    }
})

app.use('/review', (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).redirect('/');
    }else {
        next();
    }
})

app.use('/offers', (req, res, next)=> {
    if (!req.session.user) {
        return res.status(403).redirect('/');
    }else {
        next();
    }
})

app.use('/posts', (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).redirect('/');
    }else {
        next();
    }
})

app.use('/contact', (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).redirect('/');
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


app.listen(3000, () => {
    console.log('Now we got a server');
    console.log('Your routes will be running on http://localhost:3000');
})