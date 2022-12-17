const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const fs = require('fs');
const users = data.users;
const reviews = data.reviews;
const posts = data.posts;

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
    const trade8 = await users.updateTradeWith(user1Obj._id, user5Obj._id);
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
    const review9 = await reviews.createReviews(user1Obj._id, user5Obj._id, 'bad', 'this is a bad trade', '2');
    const review10 = await reviews.createReviews(user1Obj._id, user6Obj._id, 'disaster', 'this is a disaster trade', '1');


    ////////////////////////////////////////////////// post seed ////////////////////////////////////////////////
    const post1 = await posts.createPost(
        'iphone',
        'this is a iphone',
        "http://localhost:3000/images/headphone.jpg",
        'home & garden',
        user1Obj._id,
    );
    const post2 = await posts.createPost(
        'laptop',
        'this is a laptop',
        "http://localhost:3000/images/laptop.png",
        'home G garden',
        user2Obj._id,
    )


    



}


main();