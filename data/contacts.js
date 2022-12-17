const mongoCollection = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');
const validation = require('../helpers');


const contacts = mongoCollection.contacts;

const createContact = async (userId, email, subject, message) => {
    //input check
    userId = validation.checkId(userId);
    email = validation.checkEmail(email);
    subject = validation.checkReviewTitle(subject);
    message = validation.checkReviewBody(message);

    const contactColl = await contacts();

    let newContact = {
        userId: userId,
        email: email,
        subject: subject,
        message: message,
    }

    const insertInfo = await contactColl.insertOne(newContact);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not create a contact';
    }

    return {
        insertedContact: true
    }

}

module.exports = {
    createContact,
}