const express = require('express');
const router = express.Router();
const data = require('../data');
const {ObjectId} = require('mongodb');
const postData = data.posts;
const path = require('path');
//test
router
  .route('/products')
  .get(async (req, res) => {
    //code here for GET
    try{
        const prList=await postData.getAllPosts();
        return res.status(200).render('list',{productarray:prList})
    }
    catch(e){
        res.status(404).render('error',{ti: "Error Page", class: "error", message: "No Products to Display" });

    }
})

router
  .route('/:postId')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.postId = checkId(req.params.postId);
    } catch (e) {
      return res.status(400).render('error',{error: e});
    }
    try {
      const single_post = await postData.getPostById(req.params.movieId);
      return res.status(200).render('details',{prdobj:single_post});
    } catch (e) {
      return res.status(404).render('error',{ti: "Error Page",error: 'Post Not found'});
    }
  })

  router
  .route('/productreg')
  .post(async (req, res) => {
    //code here for POST
    let userInfo = req.body;
    let fileso=req.files;
    if (!userInfo.title||!userInfo.body||!fileso.imgfiles||!userInfo.category||!userInfo.tradeStatus||!userInfo.posterId)
    {
      return res.status(400).json({ error: 'the request body is not valid' });
    }
    try {
        const cpost=await postData.createPost(userInfo.title,userInfo.body,fileso.imgfiles,userInfo.category,userInfo.tradeStatus,userInfo.posterId)
        
        return res.status(200).render('details',{prdobj:cpost});

        } catch (e) {
      return res.status(404).render('error',{ti: "Error Page",error: 'unable to create Post'});
    }
  })

