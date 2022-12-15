const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require("mongodb");
const validation = require('../helpers');
const usersData = require('./users');


const users = mongoCollections.users;

// buyer write review to poster
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

    //convert rating to int
    const ratingNum = parseInt(rating);

    const usersCol = await users();

    //check whether the buyer has the right to give review
    const poster = await usersData.getUserById(posterId);
    if (!poster) {
        return {
            insertedReview: false,
            Error:`There is no user for id: ${posterId}`,
        }
    }
    const tradeWith = poster.tradeWith;

    let isBuyer = false;
    for (const trader of tradeWith) {
        if (trader === buyerId) {
            isBuyer = true;
            break;
        }
    }
    if (!isBuyer) {
        return {
            insertedReview: false,
            Error:'You cannot give review to this user as you did not have a trade relationship'
        }
    }

    // create current date
    const datetime = validation.createDateTime();

    //find review rewriter/buyer's username
    const buyer = await usersData.getUserById(buyerId);
    if (!buyer) {
        return {
            insertedReview: false,
            Error:'You cannot give review to this user as you did not have a trade relationship'
        }
    }
    let reviewWriter = buyer.username;

    let newReview = {
        _id: new ObjectId(),
        posterId: posterId,
        buyerId: buyerId,
        reviewWriter: reviewWriter,
        title: title,
        body: body,
        rating: ratingNum,
        datetime: datetime
    }

    // recalculate overallRating
    const reviews = poster.reviews;
    let newOverallRating = ratingNum;
    if (reviews.length > 0) {
        let totalRate = ratingNum;
        for (const review of reviews) {
            totalRate += review.rating;
        }
        newOverallRating = Math.round(totalRate * 10.0 / (reviews.length+1)) / 10;
    }

    // update user's reviews and overallRating
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

    return {
        insertedReview: true,
        error: null
    };
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