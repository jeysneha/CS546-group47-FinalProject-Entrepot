//require express, express router and bcrypt as shown in lecture code
const express = require('express');
const router = express.Router();
const data = require('../data');
const offerData = data.offers;
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
  // res.sendFile(path.resolve('static/offerList.html'));
  res.render("offers/offerList");

});

router.route("/myOffers").get(async (req, res) => {
  //
  // res.sendFile(path.resolve('static/myOffers.html'));
  res.render("offers/myOffers");
});

router.route("/createOffer").get(async (req, res) => {
  //
  // res.sendFile(path.resolve('static/createOffer.html'));
  res.render("offers/createOffer");
});

router.route("/page/offer/:offerId").get(async (req, res) => {
  //
  res.sendFile(path.resolve('static/offerDetail.html'));
});



// router.route("/offers/received/:postId").get(async (req, res) => {
//   // Routes for displaying the offer list page
//   res.render("offerList", {postId:req.params.postId});
// });



router.route("/images/:imgName").get(async (req, res)=>{
  // Route for fetching image of a certain offer;
  res.status(200).sendFile(path.resolve("public/offerUploads/"+req.params.imgName));
})



router.route("/:postId").get(async (req, res)=>{
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

router.route("/offer/:offerId").get(async (req, res)=>{
  // Route for feteching a ceratin offer
  offerId = req.params.offerId;
  // console.log(typeof postId)
  try{
    offer = await offerData.getOfferById(offerId);
  }catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.render("offers/offerDetail", {code:200, result:JSON.stringify(offer)})
  // res.status(200).json({code:200, result:offer});
})


router.post('/',multipartMiddleware,async (req, res) => {
  // Route for creating a new offer to the database
  console.log(req.body);
  // console.log(req.files.upload_image);
  // console.log(req.body.offerItem);

  var postId = req.body.postId;
  var senderId = req.body.senderId;

  // 之后应改成这个
  // 👇
  // var senderId = req.session.user.userId;

  var sellerId = req.body.sellerId;
  // 之后应改成这个
  // 👇
  // var sellerId = postData.getPostById(sellerId);

  var wear = req.body.wear;
  var offerItem = req.body.offerItem;
  var itemDesc = req.body.itemDesc;
  var file = req.files.upload_image;

  try{
    result = await offerData.createOffer(senderId, sellerId, postId, offerItem, itemDesc, wear, file);
  }catch(e) {
    return res.status(404).json({code:404, result:e});
  }
  
  res.status(200).json({code:200,result:result});

})


router.put('/offer/:offerId',multipartMiddleware,async (req, res) => {
  // Route for editing an offer

  // console.log(req.files.upload_image);
  // console.log(req.body.offerItem);

  var offerId = req.params.offerId;


  var senderId = "buyer";
  // 👇
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



router.delete('/offer/:offerId',async (req, res) => {

  var offerId = req.params.offerId;

  var senderId = "buyer";
  // 👇
  // var senderId = req.session.user.userId;

  try{
    result = await offerData.removeOffer(offerId, senderId);
  }
  catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.status(200).json({code:200,result:result});

})



router.put('/status/accept/:offerId',async (req, res) => {

  var offerId = req.params.offerId;
  var newAcceptStatus = req.body.newAcceptStatus;

  var sellerId = "seller";
  // 👇
  // var sellerId = req.session.user.userId;


  try{
    result = await offerData.acceptOffer(offerId, sellerId, newAcceptStatus);
  }
  catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.status(200).json({code:200,result:result});

})

router.put('/status/confirmBySeller/:offerId',async (req, res) => {

  var offerId = req.params.offerId;

  var sellerId = "seller";
  // 👇
  // var sellerId = req.session.user.userId;

  try{
    result = await offerData.confirmOfferBySeller(offerId, sellerId);
  }
  catch(e){
    console.log(e);
    return res.json({code:404, result:e});
  }

  res.status(200).json({code:200,result:result});

})


router.put('/status/confirmByBuyer/:offerId',async (req, res) => {

  var offerId = req.params.offerId;

  var buyerId = "buyer";
  // 👇
  // var buyerId = req.session.user.userId;

  try{
    result = await offerData.confirmOfferByBuyer(offerId, buyerId);
  }
  catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.status(200).json({code:200,result:result});

})




router.get('/mySent/:userId', async (req, res) => {
  // 'offers/mySent' 👆
  var userId = req.params.userId;
  // 👇 之后改
  // var userId  = req.session.user.userId;

  try{
    result = await offerData.getOffersByUserId(userId);
  }catch (e) {
    return res.status(404).json({code:404, result:e})
  }

  res.status(200).json({code:200, result:result})
})

router.get("/offers/page/edit/:offerId" , async (req, res) => {
  res.render("editOffer");
})


module.exports = router;
