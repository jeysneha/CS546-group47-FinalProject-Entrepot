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


module.exports = router;