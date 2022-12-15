const landing = require('./landing');
const userRoutes = require('./users');
const reviewsRoutes = require('./reviews');
const offersRoutes = require('./offers');
const postsRoutes = require('./posts');



const constructorMethod = (app) => {
    app.use('/', landing);
    app.use('/offers', offersRoutes);
    app.use('/user', userRoutes);
    app.use('/review', reviewsRoutes);
    app.user('/posts', postsRoutes);

    // all other urls return 404
    app.use('*', (req, res) => {
        res.status(404).render('error', {
            title: 'Error!',
            hasError: true,
            error: 'Not Found The Page'
        });
    })
}

module.exports = constructorMethod;