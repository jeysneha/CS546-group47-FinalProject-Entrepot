const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');
const validation = require('../helpers');
const posts = mongoCollections.posts;

const createPost = async (
    title,
    body,
    images,
    category,
    tradeStatus,
    posterId,
    // datetime
)=> {
        if (!title||!body||!images||!category||!tradeStatus||!posterId||!datetime)
         {
            throw 'All fields need to have valid values'
         }
         title=validation.existypestring(title);

         title=validation.checkPostTitle(title);
         body=validation.existypestring(body);
         images=validation.existypestring(images);
         category=validation.existypestring(category);
         tradeStatus=validation.existypestring(tradeStatus);
         posterId=validation.existypestring(posterId);
         // datetime=validation.existypestring(datetime);
         const date = new Date();
         let day = date.getDate();
        let mnth = date.getMonth() + 1;
        let yr = date.getFullYear();
        let hr = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        
        if (mnth < 10) {
            mnth = '0' + mnth;
        }
        if (day < 10) {
            day = '0' + day;
        }
        let datetime = `${mnth}/${day}/${yr}   ${hr}:${min}:${sec}`;
        //tradestatuscheck
        tradeStatus=validation.checktradeStatus(tradeStatus);

        posterId=ObjectId(posterId);

        const postCollection=await posts();
        const newPost={
            title:title,
            body:body,
            images:images,
            category:category,
            tradeStatus:tradeStatus,
            posterId:posterId,
            datetime:datetime

        }
        const insertInfo = await postCollection.insertOne(newPost);
 if (!insertInfo.acknowledged || !insertInfo.insertedId)
   throw 'Could not add your Post';
 const newId = insertInfo.insertedId.toString();
 const post = await getPostById(newId);
 
 return post;
};

const getAllPosts = async () => {
    const postCollection = await posts();
    const postList = await postCollection.find({}).toArray();
    if (!postList) throw 'Could not get all posts';
    for(let i=0;i<postList.length;i++)
      {postList[i]._id=postList[i]._id.toString()
  
      }
      console.log(postList)
    return postList;};
    
  
  const getPostById = async (postId) => {
    if (!postId) throw 'You must provide an id to search for';
  if (typeof postId !== 'string') throw 'Id must be a string';
  if (postId.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
    postId = postId.trim();
  if (!ObjectId.isValid(postId)) throw 'invalid object ID';
  const postCollection = await posts();
  const posto = await postCollection.findOne({_id: ObjectId(postId)});
  if (posto === null) throw 'No Post with that id';
  posto._id=posto._id.toString();
  return posto;
  };

  const updatePost = async (
    postId,
    title,
    body,
    images,
    category,
    tradeStatus,
    posterId,
    // datetime
  )=> {
        if (!postId||!title||!body||!images||!category||!tradeStatus||!posterId||!datetime)
         {
            throw 'All fields need to have valid values'
         }
         postId=validation.existypestring(postId);

         postId=validation.checkId_j(postId);

         title=validation.existypestring(title);

         title=validation.checkPostTitle(title);
         body=validation.existypestring(body);
         images=validation.existypestring(images);
         category=validation.existypestring(category);
         tradeStatus=validation.existypestring(tradeStatus);
         posterId=validation.existypestring(posterId);
         // datetime=validation.existypestring(datetime);
         const date = new Date();
         let day = date.getDate();
        let mnth = date.getMonth() + 1;
        let yr = date.getFullYear();
        let hr = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        
        if (mnth < 10) {
            mnth = '0' + mnth;
        }
        if (day < 10) {
            day = '0' + day;
        }
        let datetime = `${mnth}/${day}/${yr}   ${hr}:${min}:${sec}`;
        //tradestatus check
        tradeStatus=validation.checktradeStatus(tradeStatus);

        posterId=ObjectId(posterId);

        const postCollection=await posts();
        const updatedPost={
            title:title,
            body:body,
            images:images,
            category:category,
            tradeStatus:tradeStatus,
            posterId:posterId,
            datetime:datetime

        }
        const updatedInfo = await postCollection.updateOne(
            {_id: ObjectId(postId)},
            {$set: updatedPost}
          );
          if (updatedInfo.modifiedCount === 0) {
            throw 'could not update the post successfully';
          }
          
          return await getPostById(postId);

        } 
const removePost=async(postId)=>{
    if (!postId) throw 'Post Id ought to be provided';
    postId=validation.existypestring(postId);

    postId=validation.checkId_j(postId);
    const postCollection=await posts();
    const postor = await postCollection.findOne({_id: ObjectId(postId)});
    let ans=`${postor.title} has been successfully deleted!`
    let deletionInfo;
    if(postor.tradeStatus===2)
    //Here tradeStatus can be either 0,1 or 2 Where 2 indicates that the product has been exchanged successfully btw the seller and buyer
    {
        deletionInfo = await postCollection.deleteOne({_id: ObjectId(postId)});

    }

    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete post with id of ${postId}`;
      }
    
    return ans;
};

module.exports = {createPost,getAllPosts,getPostById,updatePost,removePost};