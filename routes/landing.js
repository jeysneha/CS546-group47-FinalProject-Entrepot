const express = require('express');
const router = express.Router();
const validation = require('../helpers');
const xss = require('xss');
const data = require('../data');
const path = require('path');
const usersData = data.users;


// first page of our application, it's an introduction page
router.route('/').get(async (req, res) => {
    res.sendFile(path.resolve('static/landing.html'));
})


// register page
router
    .route('/register')
    .get(async (req, res) => {
        if (req.session.user) {
            //if user is authenticated
            res.status(200).redirect('/posts/products');
        }else {
            res.status(200).render('landing/userRegister', {
                title: 'Entrepôt - Sign-up',
                hasErrors: false,
                error: null,
                landing: true,
                partial: 'userRegister-scripts'
            })
        }
    })
    .post(async (req, res) => {
        let username = xss(req.body.usernameInput);
        let email = xss(req.body.emailInput);
        let password = xss(req.body.passwordInput);

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
                landing: true,
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
                    landing: true,
                });
            }

            if (createInfo.insertedUser) {
                return res.status(200).render('landing/userLogin', {
                    title: 'Entrepôt - Log-in',
                    hasErrors: false,
                    error: null,
                    landing: true,
                });
            }
        }catch (e) {
            res.status(500).render('landing/userRegister', {
                title: 'Entrepôt - Sign-up',
                hasErrors: true,
                error: e,
                landing: true,
            });
        }
    })



//login page
router
    .route('/login')
    .get(async (req, res) => {
        if (req.session.user) {
            res.redirect('/posts/products');
        }else {
            res.render('landing/userLogin', {
                title: 'Entrepôt - Log-in',
                hasErrors: false,
                error: null,
                landing: true,
                partial: 'userLogin-scripts',
            })
        }
    })
    .post(async (req, res) => {
        let username = xss(req.body.usernameInput);
        let password = xss(req.body.passwordInput);

        //input check
        try{
            username = validation.checkUsername(username);
            password = validation.checkPassword(password);
        }catch (e) {
            return res.status(400).render('landing/userLogin', {
                title: 'Entrepôt - Log-in',
                hasErrors: true,
                error: e,
                landing: true,
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
                    landing: true,
                })
            }

            if (!authUser.userId) {
                return res.status(500).render('landing/userLogin',{
                    title: 'Entrepôt - Log-in',
                    hasErrors: true,
                    error: 'Internal Server Error!',
                    landing: true,
                })
            }


            if (authUser.authenticatedUser && authUser.userId) {
                req.session.user = {
                    username: username,
                    userId: authUser.userId
                };
                res.redirect('/posts/products');
            }

        }catch (e) {
            res.status(403).render('landing/userLogin', {
                title: 'Entrepôt - Log-in',
                hasErrors: true,
                error: e,
                landing: true,
            });
        }
    })


router
    .route('/logout')
    .get(async (req, res) => {
        req.session.destroy();
        res.status(200).json()
    })

module.exports = router;
