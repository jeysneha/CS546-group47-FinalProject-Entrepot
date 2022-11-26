const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');


const users = mongoCollections.users;


const createUser = async (
    name,
    email,
    hashed_password,
) => {

    // validation check

    const usersCol = await users();

    let newUser = {
        name: name,
        email: email,
        postsId: [],
        reviews: [],
        overallRating: 0,
        hashed_password: hashed_password,
        tradeWith: []
    }

    const insertInfo = await usersCol.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not create a user';
    }

    const userId = insertInfo.insertedId.toString();

    const user = await getUserById(userId);

    return user;
}

const getUserById = async (userId) => {

    // validation check


    const usersCol = await users();

    const user = await usersCol.findOne(ObjectId(userId));

    if (!user) {
        throw `Can not find user with ID ${userId}`;
    }

    //convert all id to string
    user._id = user._id.toString();

    return user;
}



module.exports = {
    createUser,
    getUserById
}