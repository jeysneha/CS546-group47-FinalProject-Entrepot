const express = require('express');
const router = express.Router();
const data = require('../data');
const validation = require('../helpers');
const xss = require('xss');

const contactData = data.contact;

router
    .route('/')
    .get(async (req, res) => {
        res.status(200).render('contact', {
            title: 'Entrepôt - Contact us',
            hasError: false,
            error: null,
        })
    })
    .post(async (req, res) => {
        const user = req.session.user;
        let userId = user.userId;

        let email = xss(req.body.contactEmailInput);
        let subject = xss(req.body.contactSubjectInput);
        let message = xss(req.body.contactMessageInput);

        try {
            userId = validation.checkId(userId);
            email = validation.checkEmail(email);
            subject = validation.checkReviewTitle(subject);
            message = validation.checkReviewBody(message);
        } catch (e) {
            return res.status(400).render('contact', {
                title: 'Entrepôt - Contact us',
                hasError: true,
                error: e,
            })
        }

        try {
            const insertInfo = await contactData.createContact(userId, email, subject, message);
            if (insertInfo.insertedContact) {
                res.status(200).redirect('/posts/products');
            }
        } catch (e) {
            return res.status(500).render('contact', {
                title: 'Entrepôt - Contact us',
                hasError: true,
                error: e,
            })
        }

    })


module.exports = router;