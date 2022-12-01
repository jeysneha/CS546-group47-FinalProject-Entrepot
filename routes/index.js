const landing = require('./landing');
const userRoutes = require('./users');
const reviewsRoutes = require('./reviews');



const constructorMethod = (app) => {
    app.use('/', landing);
    app.use('/user', userRoutes);
    app.use('/reviews', reviewsRoutes);

    // all other urls return 404
    app.use('*', (req, res) => {
        res.status(404).json({Error: 'Not Found The Page'});
    })
}

module.exports = constructorMethod;