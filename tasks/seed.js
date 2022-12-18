const dbConnection = require('../config/mongoConnection');
const mongoCollections = require('../config/mongoCollections');
const postsCollection = mongoCollections.posts;
const data = require('../data');
const fs = require('fs');
const users = data.users;
const reviews = data.reviews;
const posts = data.posts;
const {ObjectId} = require('mongodb');
const validation = require('../helpers');

async function createPostForSeed(title,
    body,
    imgFileName,
    category,
    posterId,
)  {
    


    if (!title || !body || !imgFileName || !category|| !posterId) {
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



    const postCollection = await postsCollection();
    const newPost = {
        _id: ObjectId(),
        title: title,
        body: body,
        imgFile: imgFileName,
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

    return "Successfully inserted seed data of post item";

}


async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    ////////////////////////////////////////////////// user seed ////////////////////////////////////////////////
    // recommend login as user1
    // create users
    const user1 = await users.createUser('User1', 'user1@gmail.com', 'User1Password$');
    const user2 = await users.createUser('user2', 'user2@gmail.com', 'User2Password$');
    const user3 = await users.createUser('User3', 'user3@gmail.com', 'User3Password$');
    const user4 = await users.createUser('USER4', 'USER4@gmail.com', 'User4Password$');
    const user5 = await users.createUser('User5', 'user5@gmail.com', 'User5Password$');
    const user6 = await users.createUser('User6', 'user6@gmail.com', 'User6Password$');
    const user7 = await users.createUser('User7', 'user7@gmail.com', 'User7Password$');
    const user8 = await users.createUser('User8', 'user8@gmail.com', 'User8Password$');
    const user9 = await users.createUser('User9', 'user9@gmail.com', 'User9Password$');
    const user10 = await users.createUser('User10', 'user10@gmail.com', 'User10Password$');

    // obtain all users' object
    const user1Obj = await users.getUserByName('user1');
    const user2Obj = await users.getUserByName('USER2');
    const user3Obj = await users.getUserByName('uSER3');
    const user4Obj = await users.getUserByName('usEr4');
    const user5Obj = await users.getUserByName('useR5');
    const user6Obj = await users.getUserByName('USer6');
    const user7Obj = await users.getUserByName('usER7');
    const user8Obj = await users.getUserByName('user8');
    const user9Obj = await users.getUserByName('user9');
    const user10Obj = await users.getUserByName('user10');

    ////////////////////////////////////////////////// review seed ////////////////////////////////////////////////
    // create the trade relationship first
    const trade1 = await users.updateTradeWith(user1Obj._id, user2Obj._id);
    const trade2 = await users.updateTradeWith(user3Obj._id, user4Obj._id);
    const trade3 = await users.updateTradeWith(user5Obj._id, user6Obj._id);
    const trade4 = await users.updateTradeWith(user10Obj._id, user1Obj._id);
    const trade5 = await users.updateTradeWith(user5Obj._id, user2Obj._id);
    const trade6 = await users.updateTradeWith(user1Obj._id, user3Obj._id);
    const trade7 = await users.updateTradeWith(user1Obj._id, user4Obj._id);
    const trade9 = await users.updateTradeWith(user1Obj._id, user6Obj._id);
    // create reviews from poster to buyer
    const review1 = await reviews.createReviews(user2Obj._id, user1Obj._id, 'Goode', 'this is a good trade', '5');
    const review2 = await reviews.createReviews(user3Obj._id, user4Obj._id, 'Goode', 'this is a good trade', '5');
    const review3 = await reviews.createReviews(user5Obj._id, user6Obj._id, 'Goode', 'this is a good trade', '5');
    const review4 = await reviews.createReviews(user10Obj._id, user1Obj._id, 'bad', 'this is a bad trade', '2');
    const review5 = await reviews.createReviews(user5Obj._id, user2Obj._id, 'Goode', 'this is a good trade', '5');
    // create reviews to user1
    const review6 = await reviews.createReviews(user1Obj._id, user2Obj._id, 'best', 'this is a best trade', '5');
    const review7 = await reviews.createReviews(user1Obj._id, user3Obj._id, 'good', 'this is a good trade', '4');
    const review8 = await reviews.createReviews(user1Obj._id, user4Obj._id, 'fair', 'this is a fair trade', '3');
    const review10 = await reviews.createReviews(user1Obj._id, user6Obj._id, 'disaster', 'this is a disaster trade', '1');


    ////////////////////////////////////////////////// post seed ////////////////////////////////////////////////
    const post1 = await createPostForSeed(
        'headphone',
        'this is a headphone',
        "headphone.jpg",
        '4',
        user1Obj._id,
    );
    const post2 = await createPostForSeed(
        'laptop',
        'this is a laptop',
        "laptop.png",
        '10',
        user2Obj._id,
    )
    const post3 = await createPostForSeed(
        'Apple W1 Headphone',
        'this is an Headphone',
        "AppleW1_Headphone.png",
        '4',
        user3Obj._id,
    )
    const post4 = await createPostForSeed(
        'PS4',
        'this is a Play station',
        "PS4.jpg",
        '10',
        user4Obj._id,
    )
    const post5 = await createPostForSeed(
        'MetaQuest2-VR-Headset',
        'this is MetaQuest2-VR-Headset',
        "MetaQuest2-VR-Headset.png",
        '10',
        user5Obj._id,
    )
    const post6 = await createPostForSeed(
        'LoogPro-Acoustic-Guitar',
        'this is a LoogPro_Acoustic-Guitar',
        "LoogPro_Acoustic-Guitar.jpg",
        '12',
        user5Obj._id,
    )
    const post7 = await createPostForSeed(
        'apple-ipad-air-1',
        'this is an Apple-ipad-air-1',
        "apple-ipad-air-1.jpg",
        '4',
        user6Obj._id,
    )
    
    dbConnection.closeConnection();
}


main();