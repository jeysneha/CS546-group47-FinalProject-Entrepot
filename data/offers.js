const mongoCollections = require('../config/mongoCollections');
const offers = mongoCollections.offers;

const {ObjectId} = require('mongodb');
const path = require('path');
const fs = require('fs');
const postData = require('./posts');
const userData = require('./users');
const users = mongoCollections.users;
const helpers = require("../offerHelpers")

module.exports = { 

// =================================================   Create an offer =========================================================
  async createOffer (senderId, sellerId, postId, offerItem, itemDesc, wear, file) {

    try{
      checkResult= helpers.checkCreateOffer(senderId, sellerId, postId, offerItem, itemDesc);
    }catch(e){
      throw e;
    }
    
    senderId = checkResult.senderId;
    sellerId = checkResult.sellerId;
    postId = checkResult.postId;
    offerItem = checkResult.offerItem;
    itemDesc = checkResult.itemDesc;
  
    if (file==null){
      throw "Error: Your uploaded an null file";
    }

    extend = file.originalFilename.split(".")[1]
    id = ObjectId();
    filename = id+"."+extend
    // let des_file = path.join(__dirname,'../uploads')+"/"+file.originalFilename;
    let des_file = path.join(__dirname,'../public/offerUploads')+"/"+ filename
    // console.log(des_file) //上传路径：des_file
    // console.log(file.path) //临时文件路径：file.path


    //将文件存入本地服务器文件中
    fs.readFile(file.path,function (err,data){
      //console.log(data);
      fs.writeFile(des_file,data,function(err){
        if(err){
          throw "Error: Failed to store the image";
        }
      })
    })
    // //网络访问时public目录不能出现，public是虚拟目录
    // let imgpath = `http://localhost:3000/images/${file.originalFilename}`;
    //将图片存放的地址返回
    try{
      offersArray = await this.getAllOffers(postId);
    } catch(e) {
      throw e;
    }
    let status = 0;
    if (offersArray.length !=0 ){
      for(i=0;i<offersArray.length;i++){
        if(offersArray[i].status == 1 || offersArray[i].status == -1){
          status = -1;
          break;
        }
      }
    }

    let newOffer = {
      _id: id,
      senderId: senderId,
      sellerId: sellerId,
      postId: postId,
      offerItem: offerItem,
      itemDesc: itemDesc,
      wear: wear,
      imgName: filename,
      acceptStatus: 0,
      confirmByPoster: 0,
      confirmByBuyer: 0,
      status: status,
      createTime: new Date().toUTCString()
    };
    offersCollection = await offers();
    const insertInfo = await offersCollection.insertOne(newOffer);
    if (!insertInfo.acknowledged || !insertInfo.insertedId){
      throw 'Error: Could not create the offer to database';
    }

    try{
      newId = insertInfo.insertedId.toString();
      createdOffer = await this.getOfferById(newId);
    } catch(e) {
      throw e;
    }
  
    createdOffer._id = createdOffer._id.toString();
    return createdOffer;

  },




// =================================================   get all offers =========================================================
  async getAllOffers (postId) {
    offersCollection = await offers();
    const offersArray = await offersCollection.find({"postId":postId}).toArray();

    if(offersArray.length == 0){
      return [];
    }

    for (index = 0; index < offersArray.length; index++) {
      offersArray[index]._id = offersArray[index]._id.toString();      
    }

    return offersArray;
  },



// =================================================   get an offer =========================================================
  async getOfferById (offerId) {
    offersCollection = await offers();
    usersCollection = await users();
    offerResult = await offersCollection.findOne({"_id":ObjectId(offerId)});

    if (offerResult === null) throw 'Error: No offer with that id';
    
    // query the two users' information
    sellerId = offerResult.sellerId;
    senderId = offerResult.senderId;
    
    try{
      sender = await usersCollection.findOne({"_id":ObjectId(senderId)});
      seller = await usersCollection.findOne({"_id":ObjectId(sellerId)});
    }catch(e){
      throw "Error: Failed to find the corresponding users.";
    }
    
    offerResult.senderContact = sender.email;
    offerResult.sellerContact = seller.email;


    offerResult._id = offerResult._id.toString();
    return offerResult;
  },




// =================================================   Edit an offer =========================================================
  async editOffer (offerId, senderId, offerItem, itemDesc, wear, file) {
    
    offersCollection = await offers();
    try {
      originalOffer = await this.getOfferById(offerId);
    }catch(e){
      throw e;
    }




    try{
      checkResult= helpers.checkEditOffer(offerItem, itemDesc, wear, originalOffer);
    }catch(e){
      throw e;
    }

    offerItem = checkResult.offerItem;
    itemDesc = checkResult.itemDesc;
    wear = checkResult.wear;


    if(originalOffer.senderId != senderId){
      throw "Error: You have no authority to edit this offer";
    }

    if(originalOffer.status > 0){
      throw "Error: The item is under negotiation, you cannot edit it now";
    }

    if (file==null){
      throw "Error: Your uploaded an null file";
    }

    filename = originalOffer.imgName;

    let des_file = path.join(__dirname,'../public/offerUploads')+"/"+ filename

    const isExistImg = fs.existsSync(des_file)
    if (isExistImg) {
      //删除文件
      fs.unlinkSync(des_file)
    }

    //将文件存入本地服务器文件中
    fs.readFile(file.path,function (err,data){
      fs.writeFile(des_file,data,function(err){
        if(err){
          throw "Error: Failed to store the image";
        }
      })
    })

    const updated = {
      offerItem: offerItem,
      itemDesc: itemDesc,
      wear: wear
    };
  
    const updatedInfo = await offersCollection.updateOne(
      {_id: ObjectId(offerId)},
      {$set: updated}
    );

    
    if (updatedInfo.modifiedCount === 0) {
      throw 'Error: could not update offer successfully';
    }


    try{
      updatedOffer = await this.getOfferById(offerId);
    } catch(e) {
      throw e;
    }
  
    updatedOffer._id = updatedOffer._id.toString();
    return updatedOffer;
  },



  // =================================================   Remove an offer =========================================================
  async removeOffer (offerId, senderId) {
    offersCollection = await offers();

    
    try{
      originalOffer = await this.getOfferById(offerId);
    }catch(e){
      throw e;
    }

    if(originalOffer.senderId != senderId){
      throw "Error: You have no authority to edit this offer";
    }
    if(originalOffer.status > 0){
      throw "Error: The item is under negotiation, you cannot edit it now";
    }

    const deletionInfo = await offersCollection.deleteOne({_id: ObjectId(offerId)});
    filename = originalOffer.imgName;

    let des_file = path.join(__dirname,'../public/offerUploads')+"/"+ filename
    const isExistImg = fs.existsSync(des_file)
    if (isExistImg) {
      //删除文件
      fs.unlinkSync(des_file)
    }

    if (deletionInfo.deletedCount === 0) {
      throw 'Error: Could not delete the offer with this id';
    }

    return {removedOffer:true};
  },




  // =================================================   Accept an offer =========================================================
  async acceptOffer (offerId, sellerId, newAcceptStatus) {

    offersCollection = await offers();
    try{
      originalOffer = await this.getOfferById(offerId);
    }catch(e){
      throw e;
    }
    

    if(originalOffer.sellerId != sellerId){
      throw "Error: You have no authority to edit this offer";
    }

    offerStatus = originalOffer.status;
    prevAcceptStatus = originalOffer.acceptStatus;
    confirmByBuyer = originalOffer.confirmByBuyer;
    confirmByPoster = originalOffer.confirmByPoster;

    postId = originalOffer.postId;


    residualOffers = await this.getAllOffers(postId);

    location = 0
    for(i=0;i<residualOffers.length;i++){
      if (residualOffers[i]._id.toString()==offerId){
        location = i;
        break;
      }
    }


    residualOffers.splice(location,1);
    


    if(newAcceptStatus == 1 && prevAcceptStatus == 0 && confirmByBuyer == 0 && confirmByPoster == 0 && offerStatus == 0) {

      updated = {
        acceptStatus: newAcceptStatus,
        status: 1
      };

      updatedInfo = await offersCollection.updateOne(
        {_id: ObjectId(offerId)},
        {$set: updated}
      );  
      if (updatedInfo.modifiedCount === 0) {
        throw 'Error: could not change offer\'s acceptStatus successfully111';
      }

      if(residualOffers.length != 0){
        for(i=0;i<residualOffers.length;i++){
          let residual = residualOffers[i];
          residualId = residual._id;
          residual.status = -1;
          delete residual._id;
          updatedInfo = await offersCollection.updateOne(
            {_id: ObjectId(residualId)},
            {$set: residual}
          );
          if (updatedInfo.modifiedCount === 0) {
            throw 'Error: could not change offer\'s acceptStatus successfully222';
          }
        }
      }

      try{
        
        await postData.updateTradeStatusToOne(originalOffer.postId);
      }catch(e){
        throw e;
      }
      
      return await this.getOfferById(offerId)

    } else{
      if (newAcceptStatus == 0 && prevAcceptStatus == 1 && confirmByBuyer == 0 && confirmByPoster == 0 && offerStatus == 1){

        updated = {
          acceptStatus: newAcceptStatus,
          status: 0
        };

        updatedInfo = await offersCollection.updateOne(
          {_id: ObjectId(offerId)},
          {$set: updated}
        );  
        if (updatedInfo.modifiedCount === 0) {
          throw 'Error: could not change offer\'s acceptStatus successfully333';
        }

        if(residualOffers.length != 0){
          //console.log("residual length: ", residualOffers.length);
          for(i=0;i<residualOffers.length;i++){
            
            residual = residualOffers[i];
            residualId = residual._id;
            residual.status = 0;
            delete residual._id;
            residual = {
              status: 0
            }
            //console.log(i, residual, residualId);
            //console.log("================================")
            try{
              updatedInfo = await offersCollection.updateOne(
                {_id: ObjectId(residualId)},
                {$set: residual}
              );
            }catch(e){
              //console.log(e);
              throw e;
            }
            
            //console.log(i,"√1")
            if (updatedInfo.modifiedCount === 0) {
              throw 'Error: could not change offer\'s acceptStatus successfully444';
            }
            //console.log(i,"√2")


          }
        }

        try{
          await postData.updateTradeStatusToZero(originalOffer.postId);
        }catch(e){
          throw e;
        }

        

        return await this.getOfferById(offerId);

      } else{
        throw 'Error: You are not allowed to change the accept status now';
      }
    }

  },



// =================================================   Seller confirms an offer =========================================================
  async confirmOfferBySeller(offerId, sellerId) {

    offersCollection = await offers();
    originalOffer = await this.getOfferById(offerId);

    if(originalOffer.sellerId != sellerId){
      throw "Error: You have no authority to edit this offer";
    }
    postId = originalOffer.postId;
    offerStatus = originalOffer.status;
    acceptStatus = originalOffer.acceptStatus;
    confirmByBuyer = originalOffer.confirmByBuyer;
    confirmByPoster = originalOffer.confirmByPoster;

    senderId = originalOffer.senderId;

    if (acceptStatus == 1 && confirmByPoster == 0 && confirmByBuyer == 0 && offerStatus == 1){
      // 两人中首次confirm
      updated = {
        confirmByPoster: 1,
        confirmByBuyer: confirmByBuyer,
        status: offerStatus
      };

      const updatedInfo = await offersCollection.updateOne(
        {_id: ObjectId(offerId)},
        {$set: updated}
      );  
      if (updatedInfo.modifiedCount === 0) {
        throw 'Error: could not change offer\'s confirmStatus successfully';
      }
      return await this.getOfferById(offerId)
    } else {
      if (acceptStatus == 1 && confirmByPoster == 0 && confirmByBuyer == 1 && offerStatus == 1) {
        // 对方已经接受 交易即将达成
        updated = {
          confirmByPoster: 1,
          confirmByBuyer: confirmByBuyer,
          status: 2
        };
        const updatedInfo = await offersCollection.updateOne(
          {_id: ObjectId(offerId)},
          {$set: updated}
        );
        if (updatedInfo.modifiedCount === 0) {
          throw 'Error: could not change offer\'s confirmStatus successfully';
        }

        try{
          await this.archiveOtherOffers(offerId, postId);
        }catch(e){
          throw e;
        }

        try{
          await postData.updateTradeStatusToTwo(originalOffer.postId, senderId);
        }catch(e){
          throw e;
        }

        try{
          updateResult = await userData.updateTradeWith(sellerId, senderId);
        }catch(e){
          throw e;
        }

        if(updateResult.updatedTradeWithBoth == false) {
          throw updateResult.error;
        }

        return await this.getOfferById(offerId)
      } else{
        throw 'Error: You are not allowed to change the confirm status now';
      }
    }


  },



  // =================================================   Buyer confirms an offer =========================================================
  async confirmOfferByBuyer(offerId, senderId) {

    offersCollection = await offers();
    originalOffer = await this.getOfferById(offerId);

    if(originalOffer.senderId != senderId){
      throw "Error: You have no authority to edit this offer";
    }
    postId = originalOffer.postId;
    offerStatus = originalOffer.status;
    acceptStatus = originalOffer.acceptStatus;
    confirmByBuyer = originalOffer.confirmByBuyer;
    confirmByPoster = originalOffer.confirmByPoster;
    sellderId = originalOffer.sellderId;

    if (acceptStatus == 1 && confirmByPoster == 0 && confirmByBuyer == 0 && offerStatus == 1){
      // 两人中首次confirm
      updated = {
        confirmByPoster: confirmByPoster,
        confirmByBuyer: 1,
        status: offerStatus
      };

      const updatedInfo = await offersCollection.updateOne(
        {_id: ObjectId(offerId)},
        {$set: updated}
      );  
      if (updatedInfo.modifiedCount === 0) {
        throw 'Error: could not change offer\'s confirmStatus successfully';
      }
      return await this.getOfferById(offerId)
    } else {
      if (acceptStatus == 1 && confirmByPoster == 1 && confirmByBuyer == 0 && offerStatus == 1) {
        // 对方已经接受 交易即将达成
        updated = {
          confirmByPoster: confirmByPoster,
          confirmByBuyer: 1,
          status: 2
        };
        const updatedInfo = await offersCollection.updateOne(
          {_id: ObjectId(offerId)},
          {$set: updated}
        );  
        if (updatedInfo.modifiedCount === 0) {
          throw 'Error: could not change offer\'s confirmStatus successfully';
        }

        try{
          await this.archiveOtherOffers(offerId, postId);
        }catch(e){
          throw e;
        }

        try{
          await postData.updateTradeStatusToTwo(originalOffer.postId, senderId);
        }catch(e){
          throw e;
        }

        try{
          updateResult = await userData.updateTradeWith(sellerId, senderId);
        }catch(e){
          throw e;
        }

        if(updateResult.updatedTradeWithBoth == false) {
          throw updateResult.error;
        }

        return await this.getOfferById(offerId)
      } else{
        throw 'Error: You are not allowed to change the confirm status now. Please refresh the page';
      }
    }
  },

  async getOffersByUserId(userId) {
    offersCollection = await offers();
    const offersArray = await offersCollection.find({"senderId":userId}).toArray();

    if(offersArray.length == 0){
      return [];
    }

    for (index = 0; index < offersArray.length; index++) {
      offersArray[index]._id = offersArray[index]._id.toString();      
    }

    return offersArray;
  },


  async archiveOtherOffers(offerId, postId) {

    offersArray = await this.getAllOffers(postId);

    
    for(i=0;i<offersArray.length;i++){
      if(offersArray[i]._id == offerId){
        finishedOffer = i;
        break;
      }
    }

    offersArray.splice(finishedOffer, 1);

    for(i=0;i<offersArray.length;i++){

      updated = {
        status: -2
      };
      const updatedInfo = await offersCollection.updateOne(
        {_id: ObjectId(offersArray[i]._id)},
        {$set: updated}
      );
      if (updatedInfo.modifiedCount === 0) {
        throw 'Error: could not change offer\'s confirmStatus successfully';
      }
    }
  }
}


