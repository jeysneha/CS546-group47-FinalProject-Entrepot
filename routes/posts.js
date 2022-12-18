const express = require('express');
const router = express.Router();
const data = require('../data');
const validation = require('../helpers');
// const {ObjectId} = require('mongodb');
const postsData = data.posts;
const usersData = data.users;
const path = require('path');
const multiparty = require('connect-multiparty');
// const multer = require("multer")
const multipartMiddleware = multiparty();
const xss = require('xss');

//get all active posts for products listing page
router
    .route('/products')
    .get(async (req, res) => {
        //code here for GET
        try {
            const activePosts = await postsData.getActivePosts();
            return res.status(200).render('products/list2', {
                title: 'Entrepôt - Products List',
                productArray: activePosts})
        } catch (e) {
            res.status(404).render('error', {ti: "Error Page", class: "error", message: "No Products to Display"});

        }
    });

router
.route('/edit/:postId')
.get(async (req, res) => {
    let postId = xss(req.params.postId)
    try {
        const postItem = await postsData.getPostById(postId);
        return res.status(200).render('products/update', {result: JSON.stringify(postItem), title: 'Entrepôt - Edit post'})
    } catch (e) {
        res.status(404).render('error', {ti: "Error Page", class: "error", message: "No Products to Display"});

    }
});




//update post
// router.get('/updated/:postId', async(req, res) => {
//     let postId = req.params.postId;
//     let post;
//     //param check
//     try{
//         postId = validation.checkId(postId);
//     }catch (e) {
//         return res.status(400).json({
//             code: 400,
//             result: e,
//         })
//     }
//
//     //get pos info
//     try{
//         post = await postsData.getPostById(postId);
//
//         if (!post) {
//             return res.status(404).json({
//                 code: 404,
//                 result: `Cannot find post with id ${postId} !`,
//             })
//         }
//     }catch (e) {
//         return res.status(500).json({
//             code: 500,
//             result: e,
//         })
//     }
//
//     //return post info to js
//     res.status(200).render('/products/updatePost', {
//         code: 200,
//         result: JSON.stringify(post)
//     })
//
// })
router
    .route('/:postId')
    .delete(async (req, res) => {
        let postId = xss(req.params.postId);
        try {
            let del = await postsData.getPostById(postId);
            if (!del) {
                return res.status(404).render('error', {ti: "Error Page", error: 'Post not found'});
            }
            del._id = del._id.toString()
            const obj = {};
            obj.postId = del._id
            obj.deleted = true
            //let ans=`{"movieId": ${del._id}, "deleted": true}`
            await postsData.removePost(postId);
            return res.status(200).json({result: obj});
        } catch (e) {
            return res.status(500).send('Internal Server Error');
        }

    })
    // .get(async (req, res) => {
    // //code here for GET
    // try {
    //     req.params.postId = checkId(req.params.postId);
    // } catch (e) {
    //     return res.status(400).render('error', {error: e});
    // }
    // try {
    //     const single_post = await postsData.getPostById(req.params.postId);
    //     if (!single_post) {
    //         return res.status(404).render('error', {ti: "Error Page", error: 'Post Not found'});
    //     }
    //     return res.status(200).render('details', {prdobj: single_post});
    // } catch (e) {
    //     return res.status(500).render('error', {ti: "Error Page", error: e});
    // }
    // })


router.put('/:postId',multipartMiddleware,async (req, res) => {
        //code here for PUT
        let postId = xss(req.params.postId);
        let userInfo = req.body;
        let fileso = req.files;
        let posterId = req.session.user.userId;
        console.log("--------------------")
        console.log(userInfo.title, userInfo.body, fileso.upload_image, userInfo.category)
        if (!userInfo.title || !userInfo.body || !fileso.upload_image || !userInfo.category) {
            return res.status(400).json({ti: "Error Page", error: 'The provided information is not complete'});
        }

        try {
            await postsData.getPostById(postId);


        } catch (e) {
            return res.status(404).json({ti: "Error Page", error: 'Post not found'});
        }
        try {

            const upost = await postsData.updatePost(
                postId,
                userInfo.title,
                userInfo.body,
                fileso.upload_image,
                userInfo.category,
                posterId
                )

            return res.status(200).json({prdobj: upost});
        } catch (e) {
            return res.status(404).json({ti: "Error Page", error: JSON.stringify(e)});
        }

    });


router.route('/postRegister').get(async (req, res) => {

    res.render('/products/registration-v2', {
        title: 'Entrepôt - Create post',
        hasError: false,
        error: null
    });
});

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
        return res.status(400).json({
            title: 'Entrepôt - Create post',
            hasError: true,
            error: "Please input for all required information!",
            result: "Please input for all required information!"
        });
    }

    try {
        const postObj = await postsData.createPost(title, body, imgFile, category, posterId)
        
        //after create the post update poster's postId array
        
        //console.log(posterId, postObj._id);
        const updateUserInfo = await usersData.updatePostsID(posterId, postObj._id);
        

        
        if (!updateUserInfo.updatedPostsID) {
            return res.status(400).json({
                title: 'Entrepôt - Create post',
                hasError: true,
                error: updateUserInfo.error,
                result:e
            });
        }
        

        return res.status(200).json({result: postObj});

    } catch (e) {
        // return res.status(500).render('/products/registration', {
        //     title: 'Entrepôt - Create post',
        //     hasError: true,
        //     error: 4,
        //     result: e
        // });
        return res.status(500).json({
            title: 'Entrepôt - Create post',
            hasError: true,
            error: 4,
            result: e
        });
    }
});


router.route("/images/:imgName").get(async (req, res)=>{
    // Route for fetching image of a certain offer;
    res.status(200).sendFile(path.resolve("public/postUploads/"+req.params.imgName));
})


module.exports = router;

