const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');
const validation = require('../helpers');
const bcrypt = require('bcryptjs');
const postsData = require("./posts");
const saltRounds = 14;


const users = mongoCollections.users;


//============================================== create a new user =============================================
const createUser = async (
    username,
    email,
    password,
) => {
    // validation check
    username = validation.checkUsername(username);
    email = validation.checkEmail(email);
    password = validation.checkPassword(password);


    const usersCol = await users();

    //does not allow duplicate username
    const oldUser = await usersCol.findOne({username: username});
    if (oldUser) {
        throw 'Username already exists!'
    }

    const hashed_password = await bcrypt.hash(password, saltRounds);

    let newUser = {
        username: username,
        email: email,
        hashed_password: hashed_password,
        postsId: [],
        reviews: [],
        overallRating: 0,
        tradeWith: []
    }

    const insertInfo = await usersCol.insertOne(newUser);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not create a user';
    }

    return {insertedUser: true}
}



//========================================== check if user login info is right =========================================
const checkUser = async(username, password) => {
    //input check
    username = validation.checkUsername(username);
    password = validation.checkPassword(password);

    const usersCol = await users();

    //query the db for username
    const oldUser = await usersCol.findOne({username: username});
    if (!oldUser) {
        throw 'Either the username or password is invalid!';
    }

    //compare the password
    const oldPw = oldUser.hashed_password;
    const compareResult = await bcrypt.compare(password, oldPw);
    if (!compareResult) {
        throw 'Either the username or password is invalid!';
    }

    return {
        authenticatedUser: true,
        userId: oldUser._id
    };
}




//============================================== get user object by user ID =========================================
const getUserById = async (userId) => {
    // validation check
    userId = validation.checkId(userId);

    const usersCol = await users();

    const user = await usersCol.findOne(ObjectId(userId));

    if (!user) {
        return null;
    }

    user._id = user._id.toString();

    return user;
}




//============================================== get user object by username =========================================
const getUserByName = async (username) => {
    //input check
    username = validation.checkUsername(username);

    const usersCol = await users();

    const oldUser = await usersCol.findOne({username: username});

    if (!oldUser) {
        return null;
    }
    oldUser._id = oldUser._id.toString();
    return oldUser;
}



//============================================== update user info by user self =========================================
const updateUser = async (userId, username, email, originPassword, newPassword) => {
    //input check
    userId = validation.checkId(userId);
    username = validation.checkUsername(username);
    email = validation.checkEmail(email);
    originPassword = validation.checkPassword(originPassword);
    newPassword = validation.checkPassword(newPassword);

    const usersCol = await users();

    const user = await getUserById(userId);

    //compare the input original password
    const oldPw = user.hashed_password;
    const compareResult = await bcrypt.compare(originPassword, oldPw);
    if (!compareResult) {
        throw 'The original password is not correct!';
    }

    //hash new password
    const newHashed_password = await bcrypt.hash(newPassword, saltRounds);

    const updateInfo = await usersCol.updateOne(
        {_id: ObjectId(userId)},
        {$set: {
            username: username,
                email: email,
                hashed_password: newHashed_password
            }

        }
    )

    if (updateInfo.matchedCount === 0) {
        throw `Could not match the name of the user with id: ${userId}`
    }

    if (updateInfo.modifiedCount === 0) {
        throw `The input information resulted in no change to the user with id: ${userId} `
    }

    return {updatedUser: true};

}



//============================================== update postId array =================================================
const updatePostsID = async(userId, postId) => {
    //input check
    userId = validation.checkId(userId);
    postId = validation.checkId(postId);

    //check if user exist
    const user = await getUserById(userId);
    if (!user) {
        return {
            updatedPostsID: false,
            error: `Cannot find user with id: ${userId}`,
        }
    }

    //check is post exist
    const post = await postsData.getPostById(postId);
    if (!post) {
        return {
            updatedPostsID: false,
            error: `Cannot find post with id: ${postId}`,
        }
    }

    //update user's postsId
    const usersCol = await users();
    const updateInfo = await usersCol.updateOne(
        {_id: ObjectId(userId)},
        {
            $push: {postsId: postId},
        });

    if (updateInfo.matchedCount === 0) {
        throw `Could not match the user with id: ${userId}`
    }
    if (updateInfo.modifiedCount === 0) {
        throw `The input information resulted in no change to the user with id: ${userId} `
    }

    return {
        updatedPostsID: true,
        error: null,
    }
}



//========================================== delete post from user array ===============================================
const deletePostFromUser = async(userId, postId) => {
    //input check
    userId = validation.checkId(userId);
    postId = validation.checkId(postId);

    //check if user exist
    const user = await getUserById(userId);
    if (!user) {
        return {
            deleteUserPost: false,
            error: `Cannot find user with id: ${userId} !`,
        }
    }

    //check is post exist
    const post = await postsData.getPostById(postId);
    if (post) {
        return {
            deleteUserPost: false,
            error: `Post with id: ${postId} should be deleted!`,
        }
    }

    //update user's postsId
    const usersCol = await users();
    const updateInfo = await usersCol.updateOne(
        {_id: ObjectId(userId)},
        {
            $pull: {postsId: postId},
        });

    if (updateInfo.matchedCount === 0) {
        throw `Could not match the user with id: ${userId}`
    }
    if (updateInfo.modifiedCount === 0) {
        throw `The input information resulted in no change to the user with id: ${userId} `
    }

    return {
        deleteUserPost: true,
        error: null,
    }
}


//=========================================== update the tradeWith for both users ======================================
const updateTradeWith = async(posterId, buyerId) => {
    //input check
    posterId = validation.checkId(posterId);
    buyerId = validation.checkId(buyerId);

    const usersCol = await users();

    //check if they already have trade relationship
    const poster = await getUserById(posterId);
    if (!poster) {
        return {
            updatedTradeWithBoth: false,
            error: `Cannot find user with id: ${posterId}`,

        }
    }
    const buyer = await getUserById(buyerId);
    if (!buyer) {
        return {
            updatedTradeWithBoth: false,
            error: `Cannot find user with id: ${buyerId}`,
        }
    }
    let isTradeRelationship = false;
    const tradeWithArr = poster.tradeWith;
    for (const trader of tradeWithArr) {
        if (trader === buyerId) {
            isTradeRelationship = true;
            break;
        }
    }
    if (isTradeRelationship) {
        return {
            updatedTradeWithBoth: true,
            error: null,
        }
    }

    // when they are not in trade relationship
    //update poster's tradeWith array
    const updateInfoPoster = await usersCol.updateOne(
        {_id: ObjectId(posterId)},
        {
            $push: {tradeWith: buyerId},
        });

    if (updateInfoPoster.matchedCount === 0) {
        throw `Could not match the user with id: ${posterId}`
    }
    if (updateInfoPoster.modifiedCount === 0) {
        throw `The input information resulted in no change to the user with id: ${posterId} `
    }


    //update buyer's tradeWith array
    const updateInfoBuyer = await usersCol.updateOne(
        {_id: ObjectId(buyerId)},
        {
            $push: {tradeWith: posterId},
        });

    if (updateInfoBuyer.matchedCount === 0) {
        throw `Could not match the user with id: ${buyerId}`
    }
    if (updateInfoBuyer.modifiedCount === 0) {
        throw `The input information resulted in no change to the user with id: ${buyerId} `
    }

    return {
        updatedTradeWithBoth: true,
        error: null,
    };
}




//=========================================== get all posts relevant to this user ======================================
const userGetAllPosts = async (posterId) => {
    //input check
    posterId = validation.checkId(posterId);

    //check if poster exist
    const poster = await getUserById(posterId);

    if (!poster) {
        return {
            userGetAllPosts: false,
            error: `Cannot find the user with id: ${posterId} !`
        }
    }

    //set three sets of posts of result
    const zeroStatusPost = [];
    const oneStatusPost = [];
    const twoStatusPost = [];
    const boughtPosts = [];

    // const postsArray = poster.postsId;
    result = []
    try{
        allPosts = await postsData.getAllPosts();
        for(i=0;i<allPosts.length;i++){
            if(allPosts[i].posterId == posterId){
                if (allPosts[i].tradeStatus === 0) {
                    zeroStatusPost.push(allPosts[i]);
                }else if (allPosts[i].tradeStatus === 1) {
                    oneStatusPost.push(allPosts[i]);
                }else if (allPosts[i].tradeStatus === 2) {
                    twoStatusPost.push(allPosts[i]);
                }
            }
        }
    }
    catch(e){
        throw e;
    }

    
    
    
    // find each post created by poster and classify them depends on tradeStatus
    // for (let i = 0; i < postsArray.length; i++) {
    //     thePost = await postsData.getPostById(postsArray[i]);
    //     // console.log(thePost)
    //     // console.log("1111111111111111111111111111111111111")
    //     if (!thePost) {
    //         return {
    //             userGetAllPosts: false,
    //             error: `Cannot find the post with id: ${postsArray[i]} !`
    //         }
    //     }
        
    //     if (thePost.tradeStatus === 0) {
    //         zeroStatusPost.push(thePost);
    //     }else if (thePost.tradeStatus === 1) {
    //         oneStatusPost.push(thePost);
    //     }else if (thePost.tradeStatus === 2) {
    //         twoStatusPost.push(thePost);
    //     }
    // }
    
    //find posts that the poster bought but didn't post
    
    
    for (let j = 0; j < allPosts.length; j++) {
        eachPost = allPosts[j];
        
        if (posterId === eachPost.buyerId ) {
            boughtPosts.push(eachPost);
        }
    }
    

    return {
        userGetAllPosts: true,
        error: null,
        zeroStatusPost: zeroStatusPost,
        oneStatusPost: oneStatusPost,
        twoStatusPost: twoStatusPost,
        boughtPosts: boughtPosts,
    }
}


module.exports = {
    createUser,
    checkUser,
    getUserById,
    getUserByName,
    updateUser,
    updateTradeWith,
    updatePostsID,
    userGetAllPosts,
    deletePostFromUser,
}