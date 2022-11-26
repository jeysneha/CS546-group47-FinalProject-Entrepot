const userRoutes = require('./users');



const constructorMethod = (app) => {
    app.use('/user', userRoutes);

    // all other urls return 404
    app.use('*', (req, res) => {
        res.status(404).json({Error: 'Not Found The Page'});
    })
}

module.exports = constructorMethod;