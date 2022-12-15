const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');
const validation = require('../helpers');
const posts = mongoCollections.posts;
const path = require('path');
const fs = require('fs');
const usersData = require("./users");


//================================================= create a new post ===============================================
const createPost = async (
    title,
    body,
    imgFile,
    category,
    posterId,
) => {
    if (!title || !body || !imgFile || !category|| !posterId) {
        throw 'All fields need to have valid values'
    }
    title = validation.existypestring(title);
    title = validation.checkPostTitle(title);
    body = validation.existypestring(body);
    // imgFile = validation.existypestring(imgFile);
    category = validation.existypestring(category);
    posterId = validation.existypestring(posterId);
    posterId = validation.checkId_j(posterId);

    //create instant datetime
    const datetime = validation.createDateTime();


    //create imgFile a name
    const extend = imgFile.originalFilename.split(".")[1]
    const id = ObjectId();
    const filename = id + "." + extend

    const img_dir = path.join(__dirname, '../public/postimgesUploads') + "/" + filename
    console.log(img_dir)
    console.log(imgFile.path)

    // save the imgFile path to server
    fs.readFile(imgFile.path, function (err, data) {
        fs.writeFile(img_dir, data, function (err) {
            if (err) {
                throw "Error: Failed to store the image";
            }
        })
    })

    const postCollection = await posts();
    const newPost = {
        _id: id,
        title: title,
        body: body,
        imgFile: filename,
        category: category,
        tradeStatus: 0,
        posterId: posterId,
        buyerId: null,
        datetime: datetime

    }
    const insertInfo = await postCollection.insertOne(newPost);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not add your Post';

    }

    //after create the post update poster's postId array
    const updateUserInfo = await usersData.updatePostsID(posterId, id.toString());
    if (!updateUserInfo.updatedPostsID) {
        throw updateUserInfo.error;
    }

    //if no post, throw first
    const post = await getPostById(id.toString());
    if (!post) {
        `Cannot find the post with id: ${id.toString()} !`
    }
    return post;
};


//================================================= get all posts in database ===============================================
const getAllPosts = async () => {
    const postCollection = await posts();
    const postList = await postCollection.find({}).toArray();
    if (!postList) throw 'Could not get all posts';
    for (let i = 0; i < postList.length; i++) {
        postList[i]._id = postList[i]._id.toString()

    }
    console.log(postList)
    return postList;
};



//================================================= get post by id ===============================================
const getPostById = async (postId) => {
    if (!postId) throw 'You must provide an id to search for';
    if (typeof postId !== 'string') throw 'Id must be a string';
    if (postId.trim().length === 0)
        throw 'Id cannot be an empty string or just spaces';
    postId = postId.trim();
    if (!ObjectId.isValid(postId)) throw 'invalid object ID';
    const postCollection = await posts();
    const posto = await postCollection.findOne({_id: ObjectId(postId)});
    // if (posto === null) throw `No Post with that id: ${postId}`;
    if (!posto) {
        return null;
    }
    posto._id = posto._id.toString();
    return posto;
};



//================================================= update by user self ===============================================
const updatePost = async (
    postId,
    title,
    body,
    imgFile,
    category,
    posterId,
) => {
    if (!postId || !title || !body || !imgFile  || !posterId || !datetime ||!category) {
        throw 'All fields need to have valid values'
    }
    postId = validation.existypestring(postId);
    postId = validation.checkId_j(postId);
    title = validation.existypestring(title);
    title = validation.checkPostTitle(title);
    body = validation.existypestring(body);
    imgFile = validation.existypestring(imgFile);
    category = validation.existypestring(category);
    posterId = validation.existypestring(posterId);
    posterId = validation.checkId_j(posterId);

    //create date time
    let datetime = validation.createDateTime();

    //check postId exist
    const thePost = await getPostById(postId);
    if (!thePost) {
        throw `Cannot find the post with id: ${postId} !`
    }

    //check posterId exist
    const thePoster = await usersData.getUserById(posterId);
    if (!thePoster){
        throw `Cannot find user with id: ${posterId} !`;
    }

    //check if the user has right to change post
    if (thePost.posterId !== posterId) {
        throw 'You have no authority to update this post!'
    }

    //if tradeStatus is not 0, do not allow user to update
    if (thePost.tradeStatus !== 0) {
        throw 'You cannot update the post anymore since it is under trade or traded!'
    }

    //update image with the same filename
    const filename = thePost.imgFile;

    let img_dir = path.join(__dirname,'../public/postimgesUploads')+"/"+ filename

    const isExistImg = fs.existsSync(img_dir)
    if (isExistImg) {
        //delete the origin image file
        fs.unlinkSync(img_dir)
    }


    fs.readFile(imgFile.path,function (err,data){
        fs.writeFile(img_dir,data,function(err){
            if(err){
                throw "Error: Failed to store the image";
            }
        })
    })

    const postCollection = await posts();
    const updatedPost = {
        title: title,
        body: body,
        imgFile: filename,
        category: category,
        tradeStatus: thePost.tradeStatus,
        posterId: posterId,
        buyerId: thePost.buyerId,
        datetime: datetime
    }
    const updatedInfo = await postCollection.updateOne(
        {_id: ObjectId(postId)},
        {$set: updatedPost}
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update the post successfully';
    }

    //if no post, throw first
    const post = await getPostById(postId);
    if (!post) {
        `Cannot find the post with id: ${postId} !`
    }
    return post;

}



//============================================== update trade status to 0 ===============================================
const updateTradeStatusToZero = async(postId) => {
    if (!postId) throw 'Post Id ought to be provided';
    postId = validation.existypestring(postId);
    postId = validation.checkId_j(postId);

    const thePost = await getPostById(postId);
    if (!thePost) {
        throw `Cannot find the post with id: ${postId} !`;
    }

    const postCollection = await posts();

    if (thePost.tradeStatus === 2) {
        throw 'You cannot update the post anymore since it has been traded!'
    }

    if (thePost.tradeStatus === 0) {
        return thePost;
    }

    const updatedPost = {
        tradeStatus: 0,
    }

    const updatedInfo = await postCollection.updateOne(
        {_id: ObjectId(postId)},
        {$set: updatedPost}
    );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update the post successfully';
    }

    //if no post, throw first
    const post = await getPostById(postId);
    if (!post) {
        `Cannot find the post with id: ${postId} !`
    }
    return post;
}

//============================================== update trade status to 1 ===============================================
const updateTradeStatusToOne = async(postId) => {
    if (!postId) throw 'Post Id ought to be provided';
    postId = validation.existypestring(postId);
    postId = validation.checkId_j(postId);

    const thePost = await getPostById(postId);
    if (!thePost) {
        throw `Cannot find the post with id: ${postId} !`
    }

    const postCollection = await posts();

    if (thePost.tradeStatus === 2) {
        throw 'You cannot update the post anymore since it has been traded!'
    }

    if (thePost.tradeStatus === 1) {
        return thePost;
    }

    const updatedPost = {
        tradeStatus: 1,
    }

    const updatedInfo = await postCollection.updateOne(
        {_id: ObjectId(postId)},
        {$set: updatedPost}
    );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update the post successfully';
    }

    //if no post, throw first
    const post = await getPostById(postId);
    if (!post) {
        `Cannot find the post with id: ${postId} !`
    }
    return post;
}

//============================================== update trade status to 2 ===============================================
const updateTradeStatusToTwo = async(postId) => {
    if (!postId) throw 'Post Id ought to be provided';
    postId = validation.existypestring(postId);
    postId = validation.checkId_j(postId);

    const thePost = await getPostById(postId);
    if (!thePost) {
        throw `Cannot find the post with id: ${postId} !`
    }

    const postCollection = await posts();

    if (thePost.tradeStatus === 2) {
        throw 'You cannot update the post anymore since it has been traded!'
    }

    const updatedPost = {
        tradeStatus: 2,
    }

    const updatedInfo = await postCollection.updateOne(
        {_id: ObjectId(postId)},
        {$set: updatedPost}
    );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update the post successfully';
    }

    //if no post, throw first
    const post = await getPostById(postId);
    if (!post) {
        `Cannot find the post with id: ${postId} !`
    }
    return post;
}




//================================================= delete post by user ===============================================
const removePost = async (postId) => {
    if (!postId) throw 'Post Id ought to be provided';
    postId = validation.existypestring(postId);
    postId = validation.checkId_j(postId);

    const thePost = await getPostById(postId);
    if (!thePost) {
        `Cannot find the post with id: ${postId} !`
    }

    const postCollection = await posts();

    //if tradeStatus is not 0, do not allow user to delete
    if (thePost.tradeStatus !== 0) {
        throw 'You cannot delete the post for now since it is under trade or traded!'
    }

    const deletionInfo = await postCollection.deleteOne({_id: ObjectId(postId)});
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete post with id of ${postId}`;
    }

    return {
        deletedPost: true,
    };
};



module.exports = {
    createPost, getAllPosts, getPostById, updatePost,
    removePost, updateTradeStatusToZero, updateTradeStatusToOne,
    updateTradeStatusToTwo,
};