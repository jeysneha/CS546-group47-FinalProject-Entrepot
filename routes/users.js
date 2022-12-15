const express = require('express');
const router = express.Router();
const validation = require('../helpers');
const data = require('../data');
const usersData = data.users;



router
    .route('/profile')
    .get(async (req, res) => {
    const user = req.session.user;
    let username = user.username;

    //validation check
    try{
        username = validation.checkUsername(username);
    }catch (e) {
        return res.status(403).render('error', {
            title: 'Entrepôt - Error!',
            hasError: true,
            error: e
        })
    }

    try{
        const userProfile = await usersData.getUserByName(username);

        if (!userProfile) {
            return res.status(404).render('error', {
                title: 'Entrepôt - Error!',
                hasError: true,
                error: `No user with name: ${username} was found!`
            })
        }

        //check whether each review writer exists

        res.status(200).render('user/userProfile', {
            title: 'Entrepôt - Profile',
            hasError: false,
            error: null,
            username: username,
            email: userProfile.email,
            overallRating: userProfile.overallRating,
            reviews: userProfile.reviews,
            isSelf: true,
        })
    }catch (e) {
        res.status(500).json({Error: e})
    }
})

router
    .route('/update')
    .get(async (req, res) => {
        res.status(200).render('user/userUpdate', {
            title: 'Entrepôt - Update User Info',
            hasErrors: false,
            error: null,
            partial: 'userUpdate-scripts',
        });
    })
    .put(async (req, res)=> {
        let username = req.body.usernameInput;
        let email = req.body.emailInput;
        let originPassword = req.body.originPasswordInput;
        let newPassword = req.body.newPasswordInput;

        try{
            username = validation.checkUsername(username);
            email = validation.checkEmail(email);
            originPassword = validation.checkPassword(originPassword);
            newPassword = validation.checkPassword(newPassword);
        }catch (e) {
            return res.status(400).render('user/userUpdate', {
                title: 'Entrepôt - Update User Info',
                hasErrors: true,
                error: e,
            });
        }

        //get user_id
        const user = req.session.user;
        const userId = user.userId;

        //update user
        try{
            const updateInfo = await usersData.updateUser(userId, username, email, originPassword, newPassword);

            if (!updateInfo) {
                return res.status(500).render('user/userUpdate', {
                    title: 'Entrepôt - Update User Info',
                    hasErrors: true,
                    error: 'Internal Server Error',
                });
            }

            user.username = username;

            res.status(200).redirect('/user/profile');
        }catch (e) {
            res.status(403).render('user/userUpdate', {
                title: 'Entrepôt - Update User Info',
                hasErrors: true,
                error: e,
            });
        }
})


// get other user's profile
// username with hyperlink including userId
router
    .route('/:posterId')
    .get(async (req, res) => {
        let posterId = req.params.posterId;
        // const reviewWriter = req.session.username;

        //validation check
        try{
            posterId = validation.checkId(posterId);
        }catch (e) {
            //here should render the product detail page
            return res.status(400).json({Error: e});
        }

        try{
            const posterProfile = await usersData.getUserById(posterId);

            if (!posterProfile) {
                res.status(404).json({Error: `Can not find user with ID ${posterId}`})
            }


            //check whether the review writer exists

            res.status(200).render('user/userProfile', {
                title: 'Entrepôt - Profile',
                hasError: false,
                error: null,
                username: posterProfile.username,
                email: posterProfile.email,
                overallRating: posterProfile.overallRating,
                reviews: posterProfile.reviews,
                isSelf: false,
            });
        }catch (e) {
            res.status(500).json({Error: e});
        }
    })


module.exports = router;
