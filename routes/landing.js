const express = require('express');
const router = express.Router();
const validation = require('../helpers');
const data = require('../data');
const usersData = data.users;


// first page of our application, it's an introduction page
router.route('/').get(async (req, res) => {
    res.render('landing/landing', {
<<<<<<< HEAD
        title: 'Entrepôt'
=======
        title: 'Entrepôt',
        partial: 'landing-scripts'
>>>>>>> dbca148bbf153cb7771c77dbbc4f98c4a779f135
    })
})


// register page
router
    .route('/register')
    .get(async (req, res) => {
        if (req.session.user) {
            //if user is authenticated
            res.redirect('/products');
        }else {
            res.render('landing/userRegister', {
                title: 'Entrepôt - Sign-up',
                hasErrors: false,
                error: null,
<<<<<<< HEAD
=======
                partial: 'userRegister-scripts'
>>>>>>> dbca148bbf153cb7771c77dbbc4f98c4a779f135
            })
        }
    })
    .post(async (req, res) => {
        let username = req.body.usernameInput;
        let email = req.body.emailInput;
        let password = req.body.passwordInput;

        // input check
        try{
            username = validation.checkUsername(username);
            email = validation.checkEmail(email);
            password = validation.checkPassword(password);
        }catch (e) {
            return res.status(400).render('landing/userRegister', {
                title: 'Entrepôt - Sign-up',
                hasErrors: true,
                error: e,
<<<<<<< HEAD
=======
                partial: 'userRegister-scripts'
>>>>>>> dbca148bbf153cb7771c77dbbc4f98c4a779f135
            });
        }

        //call db method
        try{
            const createInfo = await usersData.createUser(username, email, password);

            if (!createInfo) {
                return res.status(500).render('landing/userRegister', {
                    title: 'Entrepôt - Sign-up',
                    hasErrors: true,
                    error: 'Internal Server Error!',
<<<<<<< HEAD
=======
                    partial: 'userRegister-scripts'
>>>>>>> dbca148bbf153cb7771c77dbbc4f98c4a779f135
                });
            }

            if (createInfo.insertedUser) {
                return res.status(200).render('landing/userLogin', {
                    title: 'Entrepôt - Log-in',
                    hasErrors: false,
                    error: null,
<<<<<<< HEAD
=======
                    partial: 'userLogin-scripts'
>>>>>>> dbca148bbf153cb7771c77dbbc4f98c4a779f135
                });
            }
        }catch (e) {
            res.status(500).render('landing/userRegister', {
                title: 'Entrepôt - Sign-up',
                hasErrors: true,
                error: e,
<<<<<<< HEAD
=======
                partial: 'userRegister-scripts'
>>>>>>> dbca148bbf153cb7771c77dbbc4f98c4a779f135
            });
        }
    })

//login pages
router
    .route('/login')
    .get(async (req, res) => {
        if (req.session.user) {
            res.redirect('/products');
        }else {
            res.render('landing/userLogin', {
                title: 'Entrepôt - Log-in',
                hasErrors: false,
                error: null,
<<<<<<< HEAD
=======
                partial: 'userLogin-scripts',
>>>>>>> dbca148bbf153cb7771c77dbbc4f98c4a779f135
            })
        }
    })
    .post(async (req, res) => {
        let username = req.body.usernameInput;
        let password = req.body.passwordInput;

        //input check
        try{
            username = validation.checkUsername(username);
            password = validation.checkPassword(password);
        }catch (e) {
            return res.status(400).render('landing/userLogin', {
                title: 'Entrepôt - Log-in',
                hasErrors: true,
                error: e,
<<<<<<< HEAD
=======
                partial: 'userLogin-scripts',
>>>>>>> dbca148bbf153cb7771c77dbbc4f98c4a779f135
            });
        }

        //call db method
        try{
            const authUser = await usersData.checkUser(username, password);

            if (!authUser) {
                return res.status(500).render('landing/userLogin',{
                    title: 'Entrepôt - Log-in',
                    hasErrors: true,
                    error: 'Internal Server Error!',
<<<<<<< HEAD
=======
                    partial: 'userLogin-scripts',
>>>>>>> dbca148bbf153cb7771c77dbbc4f98c4a779f135
                })
            }

            if (!authUser.userId) {
                return res.status(500).render('landing/userLogin',{
                    title: 'Entrepôt - Log-in',
                    hasErrors: true,
                    error: 'Internal Server Error!',
<<<<<<< HEAD
=======
                    partial: 'userLogin-scripts',
>>>>>>> dbca148bbf153cb7771c77dbbc4f98c4a779f135
                })
            }


            if (authUser.authenticatedUser && authUser.userId) {
                req.session.user = {
                    username: username,
                    userId: authUser.userId
                };
                res.redirect('/products');
            }

        }catch (e) {
            res.status(403).render('landing/userLogin', {
                title: 'Entrepôt - Log-in',
                hasErrors: true,
                error: e,
<<<<<<< HEAD
=======
                partial: 'userLogin-scripts',
>>>>>>> dbca148bbf153cb7771c77dbbc4f98c4a779f135
            });
        }
    })


router.route('/products').get(async (req, res) => {
    const user = req.session.user;
    const username = user.username;
    const datetime = new Date().toUTCString();

    res.status(200).render('products', {
        title: 'Entrepôt - Products',
        username: username,
        datetime: datetime,
    })
})

router
    .route('/logout')
    .get(async (req, res) => {
        req.session.destroy();
        res.render('user/logout', {
            title: 'Entrepôt - Log-out'
        })
    })

module.exports = router;