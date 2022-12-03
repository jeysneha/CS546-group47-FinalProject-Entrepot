//require express, express router and bcrypt as shown in lecture code
const express = require('express');
const router = express.Router();
const data = require('../data');
const offerData = data.offer;
// const path = require('path');
// const session = require('express-session');
// const { rmSync } = require('fs');
// var formidable = require('formidable')



const path = require("path")
const multiparty = require('connect-multiparty');
const multer = require("multer")
const multipartMiddleware = multiparty();

router.route("/").get(async (req, res) => {
  //
  res.sendFile(path.resolve('static/offerList.html'));
});



router.route("/images/:imgName").get(async (req, res)=>{
  // Route for fetching image of a certain offer;
  res.status(200).sendFile(path.resolve("public/offerUploads/"+req.params.imgName));
})



router.route("/offers/:postId").get(async (req, res)=>{
  // Route for fetching all the offers of a ceratin post
  postId = req.params.postId;
  // console.log(typeof postId)
  try{
    offers = await offerData.getAllOffers(postId);
  }catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.status(200).json({code:200, result:offers});
})

router.route("/offers/offer/:offerId").get(async (req, res)=>{
  // Route for feteching a ceratin offer
  offerId = req.params.offerId;
  // console.log(typeof postId)
  try{
    offer = await offerData.getOfferById(offerId);
  }catch(e){
    return res.status(404).json({code:404, result:e});
  }
  
  res.status(200).json({code:200, result:offer});
})


router.post('/offers',multipartMiddleware,async (req, res) => {
  // Route for creating a new offer to the database

  // console.log(req.files.upload_image);
  // console.log(req.body.offerItem);

  var postId = req.body.postId;
  var senderId = req.body.senderId;

  // 之后应改成这个
  // var senderId = req.session.user.userId;

  var sellerId = req.body.sellerId;
  // 之后应改成这个
  // var sellerId = postData.getPostById(sellerId);

  
  var offerItem = req.body.offerItem;
  var itemDesc = req.body.itemDesc;
  var file = req.files.upload_image;

  try{
    result = await offerData.createOffer(senderId, sellerId, postId, offerItem, itemDesc, file);
  }catch(e) {
    return res.status(404).json({code:404, result:e});
  }
  
  res.status(200).json({code:200,result:result});

})


router.put('/offers/offer/:offerId',multipartMiddleware,async (req, res) => {
  // Route for editing an offer

  // console.log(req.files.upload_image);
  // console.log(req.body.offerItem);

  var offerId = req.params.offerId;


  var senderId = "buyer";
  // var senderId = req.session.user.userId;

  var offerItem = req.body.offerItem;
  var itemDesc = req.body.itemDesc;

  var file = req.files.upload_image;

  try{
    result = await offerData.editOffer(offerId, senderId, offerItem, itemDesc, file);
  }catch(e){
    return res.status(404).json({code:404, result:e});
  }
  
  res.status(200).json({code:200,result:result});

})



router.delete('/offers/offer/:offerId',async (req, res) => {

  var offerId = req.params.offerId;

  var senderId = "buyer";
  // var senderId = req.session.user.userId;

  try{
    result = await offerData.removeOffer(offerId, senderId);
  }
  catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.status(200).json({code:200,result:result});

})



router.put('/offers/status/accept/:offerId',async (req, res) => {

  var offerId = req.params.offerId;
  var newAcceptStatus = req.body.newAcceptStatus;

  var sellerId = "seller";
  // var sellerId = req.session.user.userId;


  try{
    result = await offerData.acceptOffer(offerId, sellerId, newAcceptStatus);
  }
  catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.status(200).json({code:200,result:result});

})

router.put('/offers/status/confirmBySeller/:offerId',async (req, res) => {

  var offerId = req.params.offerId;

  var sellerId = "seller";
  // var sellerId = req.session.user.userId;

  try{
    result = await offerData.confirmOfferBySeller(offerId, sellerId);
  }
  catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.status(200).json({code:200,result:result});

})


router.put('/offers/status/confirmByBuyer/:offerId',async (req, res) => {

  var offerId = req.params.offerId;

  var buyerId = "buyer";
  // var buyerId = req.session.user.userId;

  try{
    result = await offerData.confirmOfferByBuyer(offerId, buyerId);
  }
  catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.status(200).json({code:200,result:result});

})


module.exports = router;
