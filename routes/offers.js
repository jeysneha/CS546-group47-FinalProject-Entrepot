const express = require('express');
const router = express.Router();
const data = require('../data');
const offerData = data.offers;
const postData = data.posts;
const userData = data.users;
// const path = require('path');
// const session = require('express-session');
// const { rmSync } = require('fs');
// let formidable = require('formidable')
const path = require("path")
const multiparty = require('connect-multiparty');
// const multer = require("multer")
const multipartMiddleware = multiparty();
const xss = require('xss');

router.route("/").get(async (req, res) => {
  //
  // res.sendFile(path.resolve('static/offerList.html'));

  res.render("offers/offerList", {
    title: 'Entrepôt - Offer List',
  });

});

router.route("/offersOf/:postId").get(async (req, res) => {
  try{
    postItem = await postData.getPostById(xss(req.params.postId));

    if(!postItem) {
      return res.render("offers/offerList", {
        title: 'Entrepôt - Offer Detail',
        postid: "'"+req.params.postId+"'"
      });
    }
  }catch(e){
    return res.render("offers/offerList", {
      title: 'Entrepôt - Offer Detail',
      postid: "'"+req.params.postId+"'"
    });
  }
  
  res.render("offers/offerList", {
    title: 'Entrepôt - Offer Detail',
    postid: "'"+req.params.postId+"'",
    postImgName: "'"+postItem.imgFile+"'"
  });
});

router.route("/myOffers").get(async (req, res) => {
  //
  // res.sendFile(path.resolve('static/myOffers.html'));
  res.render("offers/myOffers", {
    title: 'Entrepôt - My Offers',
  });
});

router.route("/myPosts").get(async (req, res) => {
  //
  // res.sendFile(path.resolve('static/myOffers.html'));
  res.render("offers/myPosts", {
    title: 'Entrepôt - My Posts',
  });
});

router.route("/othersPosts/:username").get(async (req, res) => {
  
  res.render("offers/othersPosts", {
    title: 'Entrepôt - User\'s Posts',
    username: "'" + xss(req.params.username) + "'"
  });
});

router.route("/postRegister").get(async (req, res) => {
  
  res.render('products/registration-v2', {
      title: 'Entrepôt - Create post',
      hasError: false,
      error: null
  });
});




router.route("/createOffer/:postId").get(async (req, res) => {
  //
  // res.sendFile(path.resolve('static/createOffer.html'));
  try{
    postItem = await postData.getPostById(xss(req.params.postId));
  }catch(e){
    res.render("error",{hasError:true, error:e});
  }

  res.render("offers/createOffer", {
    title: 'Entrepôt - Create Offer',
    postId: "'"+req.params.postId+"'",
    title: "'"+postItem.title+"'"
  });
});

// router.route("/page/offer/:offerId").get(async (req, res) => {
//   //
//   res.sendFile(path.resolve('static/offerDetail.html'));
// });

router.route("/edit/:offerId").get(async (req, res) => {
  //
  offerId = xss(req.params.offerId);
  
  try{
    result = await offerData.getOfferById(offerId);
  }catch(e){
    return res.render("error", {hasError:true, error:e});
  }
  res.render("offers/editOffer", {title: 'Entrepôt - Edit Offer',code:200, result:JSON.stringify(result)});
});

// router.route("/offers/received/:postId").get(async (req, res) => {
//   // Routes for displaying the offer list page
//   res.render("offerList", {postId:req.params.postId});
// });
router.route("/productsCondition").post(async (req, res)=>{
  
  
  cate = Number(req.body.cate);
  stat = Number(req.body.stat);

  findResult = await postData.getAllPosts();
  allPosts = []
  for(i=0;i<findResult.length;i++){
    if(findResult[i].tradeStatus != 2){
      allPosts.push(findResult[i]);
    }
  }

  if(cate == 0 && stat == 0) {
    return res.status(200).json({code:200, result:allPosts});
  }


  condiPosts = [];
  for(i=0;i<allPosts.length;i++){
    if(cate==0 && stat != 0 && Number(allPosts[i].tradeStatus) == stat-1){
      condiPosts.push(allPosts[i]);
    } else if(cate!=0 && stat == 0 && Number(allPosts[i].category) == cate){
      condiPosts.push(allPosts[i]);
    } else if(cate!=0 && stat != 0 && Number(allPosts[i].category) == cate && Number(allPosts[i].tradeStatus) == stat-1){
      
      condiPosts.push(allPosts[i]);
    }
    
  }

  res.status(200).json({code:200, result:condiPosts});




});


router.route("/images/:imgName").get(async (req, res)=>{
  // Route for fetching image of a certain offer;
  try{
    res.status(200).sendFile(path.resolve("public/offerUploads/"+xss(req.params.imgName)));
  }catch(e){
    res.status(404).sendFile(path.resolve("public/images/no.png"));
  }
  
});



router.route("/:postId").get(async (req, res)=>{
  // Route for fetching all the offers of a ceratin post
  postId = xss(req.params.postId);

  try{
    offers = await offerData.getAllOffers(postId);
  }catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.status(200).json({code:200, result:offers});
});


router.route("/offer/:offerId").get(async (req, res)=>{
  // Route for feteching a ceratin offer
  let msg;
  if(req.url.split("?").length == 2){
    if(req.url.split("?")[1] == "created=true"){
      msg = "You have successfully created an offer!";
    }else if (req.url.split("?")[1] == "updated=true"){
      msg = "You have successfully updated an offer!";
    }
    
  }
  offerId = xss(req.params.offerId);
  userId = req.session.user.userId

  try{
    offer = await offerData.getOfferById(offerId);
  }catch(e){
    // 👇应该render到error page
    return res.render("error", {hasError:true, error:e});
  }

  try{
    postItem = await postData.getPostById(offer.postId);
    if (!postItem) {
      return res.render("error",{hasError:true, error:"Sorry. Cannot find the post item with the id"});
    }
    offer.postTitle = postItem.title;
    offer.postId = postItem._id.toString();
    offer.postImgName = postItem.imgFile;
  }catch(e){
    // 👇应该render到error page
    return res.render("error",{hasError:true, error:e});
  }

  try{
    poster = await userData.getUserById(postItem.posterId);
    offer.posterName = poster.username;
  }catch(e){
    return res.render("error",{hasError:true, error:e});
  }
  try{
    sender = await userData.getUserById(offer.senderId);
    offer.senderName = sender.username;
  }catch(e){
    return res.render("error",{hasError:true, error:e});
  }
  
  if(offer.senderId == req.session.user.userId.toString()) {
    offer.role = "buyer";
  } else if (offer.sellerId == req.session.user.userId.toString()) {
    offer.role = "seller";
  } else {
    return res.render("error",{hasError:true, error:"You have no authority to view the offer detail unrelevant to you."});
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
});


router.post('/',multipartMiddleware,async (req, res) => {
  // Route for creating a new offer to the database


  let postId = req.body.postId;
  // let senderId = req.body.senderId;

  // 之后应改成这个
  // 👇
  let senderId = req.session.user.userId;

  // let sellerId = req.body.sellerId;
  // 之后应改成这个
  // 👇
  try{
    postItem = await postData.getPostById(postId)
    if (!postItem) {
      return res.status(404).json({code:404, result:e});
    }
    if(postItem.posterId == senderId) {
      return res.status(404).json({code:404, result:"Error: You cannot provide an offer for your own posted item."})
    }
    sellerId = postItem.posterId;
  }catch(e){
    return res.status(404).json({code:404, result:e});
  }

  let wear = req.body.wear;
  let offerItem = xss(req.body.offerItem);
  let itemDesc = xss(req.body.itemDesc);
  let file = req.files.upload_image;

  try{
    result = await offerData.createOffer(senderId, sellerId, postId, offerItem, itemDesc, wear, file);
  }catch(e) {
    return res.status(404).json({code:404, result:e});
  }
  
  res.status(200).json({code:200,result:result});

});


router.put('/offer/:offerId',multipartMiddleware,async (req, res) => {
  // Route for editing an offer



  let offerId = req.params.offerId;


  // let senderId = "buyer";
  // 👇
  let senderId = req.session.user.userId;

  let offerItem = xss(req.body.offerItem);
  let itemDesc = xss(req.body.itemDesc);
  let wear = req.body.wear;
  let file = req.files.upload_image;

  try{
    result = await offerData.editOffer(offerId, senderId, offerItem, itemDesc, wear, file);
  }catch(e){
    return res.status(404).json({code:404, result:e});
  }
  
  res.status(200).json({code:200,result:result});

});



router.delete('/offer/:offerId',async (req, res) => {

  let offerId = xss(req.params.offerId);

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

});



router.put('/status/accept/:offerId',async (req, res) => {

  let offerId = xss(req.params.offerId);
  let newAcceptStatus = req.body.newAcceptStatus;

  // var sellerId = "seller";
  // 👇
  // let sellerId = "6394d87cb8d4a1f2b45a16ef";
  let sellerId = req.session.user.userId;


  try{
    result = await offerData.acceptOffer(offerId, sellerId, newAcceptStatus);
  }
  catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.status(200).json({code:200,result:result});

});

router.put('/status/confirmBySeller/:offerId',async (req, res) => {

  let offerId = xss(req.params.offerId);

  // let sellerId = "seller";
  // 👇
  let sellerId = req.session.user.userId;

  try{
    result = await offerData.confirmOfferBySeller(offerId, sellerId);
  }
  catch(e){
    
    return res.json({code:404, result:e});
  }

  res.status(200).json({code:200,result:result});

});


router.put('/status/confirmByBuyer/:offerId',async (req, res) => {

  let offerId = xss(req.params.offerId);

  // let buyerId = "buyer";
  // 👇
  let buyerId = req.session.user.userId;

  try{
    result = await offerData.confirmOfferByBuyer(offerId, buyerId);
  }
  catch(e){
    return res.status(404).json({code:404, result:e});
  }

  res.status(200).json({code:200,result:result});

});



// router.get('/mySent/:userId', async (req, res) => {
router.get('/mysent/get', async (req, res) => {
  // 'offers/mySent' 👆
  // let userId = req.params.userId;
  // 👇 之后改
  let userId  = req.session.user.userId.toString();

  try{
    result = await offerData.getOffersByUserId(userId);
  }catch (e) {
    return res.status(404).json({code:404, result:e})
  }

  res.status(200).json({code:200, result:result})
});

router.get("/offers/page/edit/:offerId" , async (req, res) => {
  res.render("editOffer", {
    title: 'Entrepôt - Edit Offer',
  });
});

router.route("/post/:postId").get(async (req, res)=>{
  // Route for feteching a ceratin offer
  let msg;
  if(req.url.split("?").length == 2){
    
    if(req.url.split("?")[1] == "created=true"){
      msg = "You have successfully created a post!";
    }else if (req.url.split("?")[1] == "updated=true"){
      msg = "You have successfully updated a post!";
    }
  }
  postId = xss(req.params.postId);
  userId = req.session.user.userId

  try{
    postItem = await postData.getPostById(postId);
    if (!postItem) {
      return res.status(404).json({code:404, result:e});
    }
  }catch(e){
    // 👇应该render到error page
    return res.status(404).json({code:404, result:e});
  }

  try{
    user = await userData.getUserById(postItem.posterId);
    postItem.contact = user.email;
    postItem.username = user.username;
  }catch(e) {
    return res.status(404).json({code:404, result:e});
  }


  if(postItem.posterId == req.session.user.userId.toString()) {
    postItem.role = "seller";
  } else {
    postItem.role = "viewer";
  }

  if (msg != null) {
    postItem.msg = msg;
  }
  
  res.render("offers/postDetail", {
    title: 'Entrepôt - Post Detail',
    code:200,
    result:JSON.stringify(postItem)
  })
  // res.status(200).json({code:200, result:offer});
});







module.exports = router;
