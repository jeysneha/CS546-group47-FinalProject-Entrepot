const express = require('express');
const router = express.Router();
const validation = require('../helpers');
const data = require('../data');

const usersData = data.users;
const reviewsDate = data.reviews;

router
    .route('/:userId')
    .get(async (req, res) => {
        let userId = req.params.userId;

        //validation check
        try{
            userId = validation.checkId(userId);
        }catch (e){
            return res.status(400).json({Error: e});
        }

        //check user
        try{
            const user = await usersData.getUserById(userId);
        }catch (e) {
            return res.status(404).json({Error: e});
        }

        //return all reviews
        try{
            const allReviews = await reviewsDate.getAllReviews(userId);

            if (allReviews.length === 0) {
                return res.status(404).json({Error: `No reviews for user with id: ${userId}`})
            }

            res.status(200).json(allReviews);

        }catch (e) {
            res.status(500).json({Error: e});
        }
    })


//only non-self user can create review
//require sent the posterId as a field in render object
router
    .route('/addReview/:posterId')
    .get(async (req, res) => {
        res.status(200).render('reviewRegister', {
            title: 'Create Review',
            hasErrors: false,
            error: null
        })
    })
    .post(async (req, res) => {
        let posterId = req.params.posterId;
        let user = req.session.user;
        let buyerId = user.userId;
        let title = req.body.titleInput;
        let body = req.body.bodyInput;
        let rating = req.body.ratingInput;

        //validation check
        try{
            posterId = validation.checkId(posterId);
            buyerId = validation.checkId(buyerId);
            title = validation.checkReviewTitle(title);
            body = validation.checkReviewBody(body);
            rating = validation.checkReviewRating(rating);
        }catch (e) {
            //render the profile page
            return res.status(400).render('reviewRegister', {
                title: 'Create Review',
                hasErrors: true,
                error: e
            })
        }

        try{
            const insertInfo = await reviewsDate.createReviews(posterId, buyerId, title, body, rating.toString());

            if (!insertInfo) {
                return res.status(500).render('reviewRegister', {
                    title: 'Create Review',
                    hasErrors: true,
                    error: 'Internal Server Error'
                });
            }

            if (!insertInfo.insertedReview) {
                return res.status(403).render('reviewRegister', {
                    title: 'Create Review',
                    hasErrors: true,
                    error: insertInfo.Error
                });
            }

            res.status(200).redirect(`/user/${posterId}`);
            // res.status(200).json('Insert review successfully!');

        }catch (e) {
            res.status(500).json({Error: e});
        }


    })


module.exports = router;