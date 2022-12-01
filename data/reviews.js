const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require("mongodb");
const validation = require('../helpers');


const users = mongoCollections.users;

const createReviews = async (
    posterId,
    buyerId,
    title,
    body,
    rating
) => {
    //validation check
    posterId = validation.checkId(posterId);
    buyerId = validation.checkId(buyerId);
    title = validation.checkReviewTitle(title);
    body = validation.checkReviewBody(body);
    rating = validation.checkReviewRating(rating);

    const usersCol = await users();

    //check whether the buyer has the right to give review
    const poster = await usersCol.findOne(ObjectId(posterId));
    const tradeWith = poster.tradeWith;
    let isBuyer = false;

    for (const trader of tradeWith) {
        if (trader === buyerId) {
            isBuyer = true;
            break;
        }
    }
    if (!isBuyer) {
        throw 'You cannot give review to this user as you did not have a trade relationship';
    }

    // create current date
    const today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth()+1;
    let dd = today.getDate();
    let hr = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();
    //when mm or dd has only one number add 0 in front of it
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (dd < 10) {
        dd = '0' + dd;
    }
    const datetime = `${mm}/${dd}/${yyyy}  ${hr}:${min}:${sec}`;

    let newReview = {
        _id: new ObjectId(),
        posterId: posterId,
        buyerId: buyerId,
        title: title,
        body: body,
        rating: rating,
        datetime: datetime
    }

    // recalculate overallRating
    const reviews = poster.reviews;
    let newOverallRating = rating;
    if (reviews.length > 0) {
        let totalRate = rating;
        for (const review of reviews) {
            totalRate += review.rating;
        }
        newOverallRating = Math.round(totalRate * 10.0 / (reviews.length+1)) / 10;
    }

    // update movie's reviews and overallRating
    const updateInfo = await usersCol.updateOne(
        {_id: ObjectId(posterId)},
        {
            $push: {reviews: newReview},
            $set: {overallRating: newOverallRating}
        });

    if (updateInfo.matchedCount === 0) {
        throw `Could not match the user with id: ${posterId}`
    }
    if (updateInfo.modifiedCount === 0) {
        throw `The input information resulted in no change to the user with id: ${posterId} `
    }

    return {insertedReview: true};
}

const getAllReviews = async(userId) => {
    //validation check
    userId = validation.checkId(userId);

    const usersCol = await users();
    const reviewsObj = await usersCol.findOne({_id: ObjectId(userId)}, {projection: {_id: 0, reviews: 1}});

    if (reviewsObj.reviews.length === 0) {
        return [];
    }
    for (let i = 0; i < reviewsObj.reviews.length; i++) {
        reviewsObj.reviews[i]._id = reviewsObj.reviews[i]._id.toString();
    }
    return reviewsObj.reviews;
}

const getReviewById = async(reviewId) => {
    //validation check
    reviewId = validation.checkId(reviewId);

    const usersCol = await users();

    const reviewsObj = await usersCol.find({"reviews._id": ObjectId(reviewId)}, {projection: {_id: 0, reviews: 1}}).toArray();

    if (reviewsObj.length === 0) {
        throw `Could not find review with id: ${reviewId}`;
    }
    const theReviews = reviewsObj[0].reviews;
    let theReview;
    for (const review of theReviews) {
        if (review._id.toString() === reviewId) {
            theReview = review;
            break;
        }
    }
    if (!theReview) {
        throw `Could not find review with id: ${reviewId}`;
    }
    theReview._id = theReview._id.toString();

    return theReview;
}


module.exports = {
    createReviews,
    getAllReviews,
    getReviewById
}