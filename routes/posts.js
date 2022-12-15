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
});

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
      const single_post = await postData.getPostById(req.params.postId);
      return res.status(200).render('details',{prdobj:single_post});
    } catch (e) {
      return res.status(404).render('error',{ti: "Error Page",error: 'Post Not found'});
    }
  })
  .put(async (req, res) => {
    //code here for PUT
    let userInfo = req.body;
    let fileso=req.files;
    if (!userInfo.title||!userInfo.body||!fileso.imgfiles||!userInfo.category||!userInfo.tradeStatus||!userInfo.posterId)
    {
      return res.status(400).render('error',{ti: "Error Page",error: 'the request body is not valid'}); 
    }
    /*try {
      req.params.movieId = checkId(req.params.movieId);
    } catch (e) {
      return res.status(400).json({error: e});
    }*/
    
    try {
      await postData.getPostById(req.params.postId);
      
      
    } catch (e) {
      return res.status(404).render('error',{ti: "Error Page",error: 'Post not found'});
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
        return res.status(200).render('details',{prdobj:upost});
    } catch (e) {
      return res.status(404).render('error',{ti: "Error Page",error: 'unable to update Post'});
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
       return res.status(404).render('error',{ti: "Error Page",error: 'Post not found'});
    }
  
    try {
      const del=await postData.getPostById(req.params.postId);
      del._id=del._id.toString()
      const obj={};
      obj.postId=del._id
      obj.deleted=true
      //let ans=`{"movieId": ${del._id}, "deleted": true}`
      await postData.removePost(req.params.postId);
      return res.status(200).render('delete',{d_obj:obj});
    } catch (e) {
      return res.status(500).send('Internal Server Error');
    }

  });

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
  });
  module.exports = router;

