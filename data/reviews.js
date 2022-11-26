const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require("mongodb");


const users = mongoCollections.users;

const createReviews = async (
    posterId,
    buyerId,
    title,
    body,
    rating
) => {

    //validation check


    //check whether the buyer has the right to give review


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
        dateTime: datetime
    }

    const usersCol = await users();

    // recalculate overallRating


    const updateInfo = await usersCol.updateOne(
        {_id: ObjectId(posterId)},
        {
            $push: {reviews: newReview}
        });


    if (updateInfo.matchedCount === 0) {
        throw `Could not match the poster with id: ${posterId}`
    }
    if (updateInfo.modifiedCount === 0) {
        throw `The input information resulted in no change to the poster with id: ${posterId} `
    }

    return getReviewById(newReview._id.toString());
}



const getReviewById = async(reviewId) => {

    //validation check

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
    getReviewById
}