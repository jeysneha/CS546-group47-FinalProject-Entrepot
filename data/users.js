const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');
const validation = require('../helpers');
const bcrypt = require('bcryptjs');
const saltRounds = 14;


const users = mongoCollections.users;


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

    return {authenticatedUser: true};
}

const getUserById = async (userId) => {
    // validation check
    userId = validation.checkId(userId);

    const usersCol = await users();

    const user = await usersCol.findOne(ObjectId(userId));

    if (!user) {
        throw `Can not find user with ID ${userId}`;
    }

    //convert all id to string
    user._id = user._id.toString();

    return user;
}


const getUserByName = async (username) => {
    //input check
    username = validation.checkUsername(username);

    const usersCol = await users();

    const oldUser = await usersCol.findOne({username: username});

    if (!oldUser) {
        return null;
    }
    return oldUser;
}


//update user information
const updateUser = async (userId) => {

}


module.exports = {
    createUser,
    checkUser,
    getUserById,
    getUserByName,
    updateUser
}