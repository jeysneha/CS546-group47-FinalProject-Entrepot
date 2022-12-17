
const offers = require('./offers');
const usersData = require('./users');
const reviewsData = require('./reviews');
const postsData = require('./posts')
const contactData = require('./contacts');


module.exports = {
    users: usersData,
    reviews: reviewsData,
    posts:postsData,
    offers:offers,
    contact: contactData,
}