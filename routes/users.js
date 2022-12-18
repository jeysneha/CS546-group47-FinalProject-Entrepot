const express = require('express');
const router = express.Router();
const validation = require('../helpers');
const data = require('../data');
const usersData = data.users;
const xss = require('xss');
const {getUserById, getUserByName} = require("../data/users");



//=========================================== update user info by user self ======================================
router
    .route('/update')
    .get(async (req, res) => {
        let user = req.session.user;
        let username = user.username;
        let owner;
        let email;
        try {
            owner = await getUserByName(username);
            email = owner.email;
            if (!owner) {
                return res.status(400).render('user/userUpdate', {
                    title: 'Entrepôt - Update User Info',
                    hasErrors: true,
                    error: `Cannot find the user with name ${username}`,
                    partial: 'userUpdate-scripts',
                })
            }
        } catch (e) {
            return res.status(400).render('user/userUpdate', {
                title: 'Entrepôt - Update User Info',
                hasErrors: true,
                error: e,
                partial: 'userUpdate-scripts',
            })
        }

        res.status(200).render('user/userUpdate', {
            title: 'Entrepôt - Update User Info',
            hasErrors: false,
            error: null,
            username: username,
            email: email,
            partial: 'userUpdate-scripts',
        });
    })
    .put(async (req, res)=> {
        let username = xss(req.body.usernameInput);
        let email = xss(req.body.emailInput);
        let originPassword = xss(req.body.originPasswordInput);
        let newPassword = xss(req.body.newPasswordInput);

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
            return res.status(500).render('user/userUpdate', {
                title: 'Entrepôt - Update User Info',
                hasErrors: true,
                error: e,
            });
        }
    })




//=========================================== get all posts by user self ======================================
router
    .route('/deal')
    .get(async (req, res) => {
        
        const user = req.session.user;
        let posterId = user.userId;
        
        //valid check
        try {
            posterId = validation.checkId(posterId);
        }catch (e) {
            return res.status(400).json(e)
        }
        
        try {
            
            const poster = await getUserById(posterId);
            
            //check whether user exist
            if (!poster) {
                return res.status(404).json(`Cannot find user with id: ${posterId} !`)
            }
            
            //get all classified posts
            const returnInfo = await usersData.userGetAllPosts(posterId);
            
            if (!returnInfo.userGetAllPosts){
                return res.status(404).json(returnInfo.error);
            }
            
            res.status(200).json({
                zeroStatusPost: returnInfo.zeroStatusPost,
                oneStatusPost: returnInfo.oneStatusPost,
                twoStatusPost: returnInfo.twoStatusPost,
                boughtPosts: returnInfo.boughtPosts,
            })
            

        }catch (e) {
            return res.status(500).json(e);
        }
    })


//=========================================== get other user's all posts ======================================
router
    .route('/deal/:username')
    .get(async(req, res) => {
        let username = req.params.username;
        //valid check
        try {
            // posterId = validation.checkId(posterId);
            username = validation.checkUsername(username);
        }catch (e) {

            return res.status(400).json(e)
        }

        try {

            const poster = await getUserByName(username);

            //check whether user exist
            if (!poster) {
                return res.status(404).json(`Cannot find user with id: ${username} !`)
            }

            //get all classified posts
            const returnInfo = await usersData.userGetAllPosts(poster._id.toString());

            if (!returnInfo.userGetAllPosts){
                return res.status(404).json(returnInfo.error);
            }

            res.status(200).json({
                zeroStatusPost: returnInfo.zeroStatusPost,
                oneStatusPost: returnInfo.oneStatusPost,
                twoStatusPost: returnInfo.twoStatusPost,
                boughtPosts: returnInfo.boughtPosts,
            })


        }catch (e) {
            return res.status(500).json(e);
        }

    })


//=========================================== get profile by user self ======================================
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
        return res.status(500).render('error', {
            title: 'Entrepôt - Error!',
            hasError: true,
            error: e,
        });
    }
});


router
    .route('/profile/:username')
    .get(async (req, res) => {
    const user = req.session.user;
    let username = user.username;
    let targetUsername = req.params.username


    //validation check
    try{
        username = validation.checkUsername(targetUsername);
        
    }catch (e) {
        return res.status(403).render('error', {
            title: 'Entrepôt - Error!',
            hasError: true,
            error: e
        })
    }
    try{
        const userProfile = await usersData.getUserByName(targetUsername);
        if (!userProfile) {
            return res.status(404).render('error', {
                title: 'Entrepôt - Error!',
                hasError: true,
                error: `No user with name: ${targetUsername} was found!`
            })
        }
        //check whether each review writer exists
        if(userProfile._id.toString() === user.userId){
            res.status(200).render('user/userProfile', {
                title: 'Entrepôt - Profile',
                hasError: false,
                error: null,
                username: targetUsername,
                email: userProfile.email,
                overallRating: userProfile.overallRating,
                reviews: userProfile.reviews,
                isSelf: true,
            })
        }else{
            res.status(200).render('user/userProfile', {
                title: 'Entrepôt - Profile',
                hasError: false,
                error: null,
                //posterId: posterId,
                username: targetUsername,
                email: userProfile.email,
                overallRating: userProfile.overallRating,
                reviews: userProfile.reviews,
                isSelf: false,
            });
        }
        
    }catch (e) {
        return res.status(500).render('error', {
            title: 'Entrepôt - Error!',
            hasError: true,
            error: e,
        });
    }
});


//=========================================== get other user's profile ======================================
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
            //here should render the product detail fpage
            return res.status(400).render('error', {
                title: 'Entrepôt - Error',
                hasError: true,
                error: e
            });
        }

        try{
            const posterProfile = await usersData.getUserById(posterId);

            if (!posterProfile) {
                return res.status(404).render('error', {
                    title: 'Entrepôt - Error',
                    hasError: true,
                    error: `Can not find user with ID ${posterId}`,
                });
            }


            //check whether the review writer exists

            res.status(200).render('user/userProfile', {
                title: 'Entrepôt - Profile',
                hasError: false,
                error: null,
                posterId: posterId,
                username: posterProfile.username,
                email: posterProfile.email,
                overallRating: posterProfile.overallRating,
                reviews: posterProfile.reviews,
                isSelf: false,
            });
        }catch (e) {
            return res.status(500).render('error', {
                title: 'Entrepôt - Error',
                hasError: true,
                error: e,
            });
        }
    });


module.exports = router;
