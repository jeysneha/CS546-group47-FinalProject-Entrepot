const express = require('express');
const router = express.Router();
const data = require('../data');
const {ObjectId} = require('mongodb');
const postData = data.posts;
const path = require('path');
const multiparty = require('connect-multiparty');
const multer = require("multer")
const multipartMiddleware = multiparty();
const xss = require('xss');

//test
router
    .route('/products')
    .get(async (req, res) => {
        //code here for GET
        try {
            const prList = await postData.getAllPosts();
            return res.status(200).render('list', {productarray: prList})
        } catch (e) {
            res.status(404).render('error', {ti: "Error Page", class: "error", message: "No Products to Display"});

        }
    });

router
    .route('/:postId')
    .get(async (req, res) => {
        //code here for GET
        try {
            req.params.postId = checkId(req.params.postId);
        } catch (e) {
            return res.status(400).render('error', {error: e});
        }
        try {
            const single_post = await postData.getPostById(req.params.postId);
            return res.status(200).render('details', {prdobj: single_post});
        } catch (e) {
            return res.status(404).render('error', {ti: "Error Page", error: 'Post Not found'});
        }
    })
    .put(async (req, res) => {
        //code here for PUT
        let userInfo = req.body;
        let fileso = req.files;
        if (!userInfo.title || !userInfo.body || !fileso.imgfiles || !userInfo.category || !userInfo.tradeStatus || !userInfo.posterId) {
            return res.status(400).render('error', {ti: "Error Page", error: 'the request body is not valid'});
        }
        /*try {
          req.params.movieId = checkId(req.params.movieId);
        } catch (e) {
          return res.status(400).json({error: e});
        }*/

        try {
            await postData.getPostById(req.params.postId);


        } catch (e) {
            return res.status(404).render('error', {ti: "Error Page", error: 'Post not found'});
        }
        try {

            const upost = await postData.updatePost(
                req.params.postId,
                userInfo.title,
                userInfo.body,
                fileso.imgfiles,
                userInfo.category,
                userInfo.tradeStatus,
                userInfo.posterId)
            return res.status(200).render('details', {prdobj: upost});
        } catch (e) {
            return res.status(404).render('error', {ti: "Error Page", error: 'unable to update Post'});
        }

    })
    .delete(async (req, res) => {
        //code here for DELETE
        /* try {
           req.params.movieId = checkId(req.params.movieId);
         } catch (e) {
           return res.status(400).json({error: e});
         }*/
        try {
            await postData.getPostById(req.params.postId);

        } catch (e) {
            return res.status(404).render('error', {ti: "Error Page", error: 'Post not found'});
        }

        try {
            const del = await postData.getPostById(req.params.postId);
            del._id = del._id.toString()
            const obj = {};
            obj.postId = del._id
            obj.deleted = true
            //let ans=`{"movieId": ${del._id}, "deleted": true}`
            await postData.removePost(req.params.postId);
            return res.status(200).render('delete', {d_obj: obj});
        } catch (e) {
            return res.status(500).send('Internal Server Error');
        }

    });

router.route('/postRegister').get(async (req, res) => {
    res.render('/products/registration', {
        title: 'Entrepôt - Create post',
        hasError: false,
        error: null
    });
})



router.post('/postRegister', multipartMiddleware, async (req, res) => {
    //code here for POST
    const session = req.session.user;
    let posterId = session.userId;
    let userInfo = req.body;
    let title = xss(userInfo.postRegTitleInput);
    let body = xss(userInfo.postRegBodyInput);
    let imgFile = req.files.upload_image;
    let category = req.body.postRegCategoryInput;

    if (!title || !body || !imgFile || !category) {
        return res.status(400).render('/products/registration', {
            title: 'Entrepôt - Create post',
            hasError: true,
            error: "Please input for all required information!"
        });
    }

    try {
        const postObj = await postData.createPost(title, body, imgFile, category, posterId)

        return res.status(200).render('products/details', {postObj: postObj});

    } catch (e) {
        return res.status(500).render('/products/registration', {
            title: 'Entrepôt - Create post',
            hasError: true,
            error: 4
        });
    }
});


router.route("/images/:imgName").get(async (req, res)=>{
    // Route for fetching image of a certain offer;
    res.status(200).sendFile(path.resolve("public/postUploads/"+req.params.imgName));
})


module.exports = router;

