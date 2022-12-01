const express = require('express');
const router = express.Router();
const validation = require('../helpers');
const data = require('../data');
const usersData = data.users;



router.route('/profile').get(async (req, res) => {
    // if user is not authenticated, redirect to landing page
    if (!req.session.user) {
        res.status(403).redirect('/');
    }else {
        const user = req.session.user;
        const username = user.username;

        //validation check??

        try{
            const userProfile = await usersData.getUserByName(username);
            if (!userProfile) {
                res.status(404).json({Error: `No user with name: ${username} was found!`})
            }else {
                res.status(200).render('userProfile', {
                    title: 'Personal Profile',
                    username: username,
                    email: userProfile.email,
                    overallRating: userProfile.overallRating,
                    reviews: userProfile.reviews,
                })
            }
        }catch (e) {
            res.status(500).json({Error: e})
        }
    }

})




module.exports = router;
