const express = require("express");
const path = require("path");
const app = express();
<<<<<<< HEAD
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
=======
// const publicPath = path.resolve(__dirname, "/public");
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
>>>>>>> dbca148bbf153cb7771c77dbbc4f98c4a779f135
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

app.use('/products', (req, res, next) => {
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


app.listen(3000, (req, res) => {
    console.log('Now we got a server');
    console.log('Your routes will be running on http://localhost:3000');
})

