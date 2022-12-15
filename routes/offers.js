//require express, express router and bcrypt as shown in lecture code
const express = require('express');
const router = express.Router();
const data = require('../data');
const offerData = data.offers;
// const path = require('path');
// const session = require('express-session');
// const { rmSync } = require('fs');
// let formidable = require('formidable')



const path = require("path")
const multiparty = require('connect-multiparty');
const multer = require("multer")
const multipartMiddleware = multiparty();

router.route("/").get(async (req, res) => {
  //
  // res.sendFile(path.resolve('static/offerList.html'));
  console.log(req.session.user.userId);
  res.render("offers/offerList", {
    title: 'Entrepôt - Offer List',
  });

});

router.route("/myOffers").get(async (req, res) => {
  //
  // res.sendFile(path.resolve('static/myOffers.html'));
  res.render("offers/myOffers", {
    title: 'Entrepôt - My Offers',
  });
});

router.route("/createOffer").get(async (req, res) => {
  //
  // res.sendFile(path.resolve('static/createOffer.html'));
  res.render("offers/createOffer", {
    title: 'Entrepôt - Create Offer',
  });
});

// router.route("/page/offer/:offerId").get(async (req, res) => {
//   //
//   res.sendFile(path.resolve('static/offerDetail.html'));
// });

router.route("/edit/:offerId").get(async (req, res) => {
  //
  offerId = req.params.offerId;
  // console.log(typeof postId)
  try{
    result = await offerData.getOfferById(offerId);
  }catch(e){
    return res.status(404).json({code:404, result:e});
  }
  res.render("offers/editOffer", {code:200, result:JSON.stringify(result)});
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
  let msg;
  if(req.url.split("?").length == 2){
    
    msg = "You have successfully created an offer!";
  }
  offerId = req.params.offerId;
  userId = req.session.user.userId

  try{
    offer = await offerData.getOfferById(offerId);
  }catch(e){
    // 👇应该render到error page
    return res.status(404).json({code:404, result:e});
  }
  
  if(offer.senderId == req.session.user.userId.toString()) {
    offer.role = "buyer";
  } else if (offer.sellerId == req.session.user.userId.toString()) {
    offer.role = "seller";
  } else {
    console.log("Redirect to Error Page");
  }


  if (msg != null) {
    offer.msg = msg;
  }
  

  res.render("offers/offerDetail", {
    title: 'Entrepôt - Offer Detail',
    code:200,
    result:JSON.stringify(offer)
  })
  // res.status(200).json({code:200, result:offer});
})


router.post('/',multipartMiddleware,async (req, res) => {
  // Route for creating a new offer to the database
  console.log(req.body);
  // console.log(req.files.upload_image);
  // console.log(req.body.offerItem);

  let postId = req.body.postId;
  // let senderId = req.body.senderId;

  // 之后应改成这个
  // 👇
  let senderId = req.session.user.userId;

  let sellerId = req.body.sellerId;
  // 之后应改成这个
  // 👇
  // let sellerId = postData.getPostById(sellerId);

  let wear = req.body.wear;
  let offerItem = req.body.offerItem;
  let itemDesc = req.body.itemDesc;
  let file = req.files.upload_image;

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

  let offerId = req.params.offerId;


  // let senderId = "buyer";
  // 👇
  let senderId = req.session.user.userId;

  let offerItem = req.body.offerItem;
  let itemDesc = req.body.itemDesc;
  let wear = req.body.wear;
  let file = req.files.upload_image;

  try{
    result = await offerData.editOffer(offerId, senderId, offerItem, itemDesc, wear, file);
  }catch(e){
    return res.status(404).json({code:404, result:e});
  }
  
  res.status(200).json({code:200,result:result});

})



router.delete('/offer/:offerId',async (req, res) => {

  let offerId = req.params.offerId;

  // let senderId = "buyer";
  // 👇
  let senderId = req.session.user.userId;

  try{
    result = await offerData.removeOffer(offerId, senderId);
  }
  catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.status(200).json({code:200,result:result});

})



router.put('/status/accept/:offerId',async (req, res) => {

  let offerId = req.params.offerId;
  let newAcceptStatus = req.body.newAcceptStatus;

  // var sellerId = "seller";
  // 👇
  let sellerId = "6394d87cb8d4a1f2b45a16ef";
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

  let offerId = req.params.offerId;

  let sellerId = "seller";
  // 👇
  // let sellerId = req.session.user.userId;

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

  let offerId = req.params.offerId;

  let buyerId = "buyer";
  // 👇
  // let buyerId = req.session.user.userId;

  try{
    result = await offerData.confirmOfferByBuyer(offerId, buyerId);
  }
  catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.status(200).json({code:200,result:result});

})



// router.get('/mySent/:userId', async (req, res) => {
router.get('/mysent/get', async (req, res) => {
  // 'offers/mySent' 👆
  // let userId = req.params.userId;
  // 👇 之后改
  let userId  = req.session.user.userId.toString();
  // console.log(userId);
  // console.log("11111111111")
  try{
    result = await offerData.getOffersByUserId(userId);
  }catch (e) {
    return res.status(404).json({code:404, result:e})
  }

  res.status(200).json({code:200, result:result})
})

router.get("/offers/page/edit/:offerId" , async (req, res) => {
  res.render("editOffer", {
    title: 'Entrepôt - Edit Offer',
  });
})


module.exports = router;
