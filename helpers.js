const {ObjectId} = require('mongodb');

module.exports = {

    checkUsername(name) {
        if (!name) {
            throw 'User name is not provided!'
        }
        if (typeof name !== 'string') {
            throw 'User name should be a string!'
        }
        name = name.trim();
        if (name === '') {
            throw 'User name cannot be empty string or spaces only!'
        }
        if (name.length < 4) {
            throw 'Username must contain at least 4 characters!'
        }
        const spaceRegex = /\s/;
        if (spaceRegex.test(name)) {
            throw 'Username must not contain space!'
        }
        name = name.toLowerCase();
        const alphanumericRegex = /^\w+$/;
        if (!alphanumericRegex.test(name)) {
            throw 'Username must contain letters and numbers only!'
        }
        return name;
    },

    checkEmail(email) {
        if (!email) {
            throw 'Email is not provided!';
        }
        if (typeof email !== "string") {
            throw 'Email should be a string!'
        }
        email = email.trim();
        if (email === '') {
            throw 'Email cannot be empty string or space only!'
        }
        email = email.toLowerCase();

        const spaceRegex = /\s/;
        if (spaceRegex.test(email)) {
            throw 'Email must not contain space!'
        }

        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
        if (!emailRegex.test(email)) {
            throw 'Invalid email!'
        }
        return email;
    },

    checkPassword(password) {
        if (!password) {
            throw 'Password is not provided!';
        }
        if (typeof password !== "string") {
            throw 'Password should be a string!'
        }
        password = password.trim();
        if (password === '') {
            throw 'Password cannot be empty string or space only!'
        }
        if (password.length < 6) {
            throw 'Password must contain at least 6 characters!'
        }
        const spaceRegex = /\s/;
        if (spaceRegex.test(password)) {
            throw 'Password must not contain space!'
        }
        const requireRegex = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W)/;
        if (!requireRegex.test(password)) {
            throw 'Password must contain at least 1 uppercase character, at least 1 lowercase character, at least 1 number, at least 1 special character!'
        }
        return password;

    },

    checkId(id) {
        if (!id) {
            throw 'User ID is not provided!'
        }
        if (typeof id !== 'string') {
            throw 'User ID should be a sting!'
        }
        id = id.trim();
        if (id === '') {
            throw 'User ID cannot be empty string or space only!'
        }
        if (!ObjectId.isValid(id)) {
            throw 'Invalid object ID'
        }
        return id;
    },

    checkReviewTitle(title) {
        if (!title) {
            throw 'Review title is not provided!'
        }
        if (typeof title !== 'string') {
            throw 'Review title should be a sting!'
        }
        title = title.trim();
        if (title === '') {
            throw 'Review title cannot be empty string or space only!'
        }
        return title;
    },

    checkReviewBody(body) {
        if (!body) {
            throw 'Review body is not provided!'
        }
        if (typeof body !== 'string') {
            throw 'Review body should be a sting!'
        }
        body = body.trim();
        if (body === '') {
            throw 'Review body cannot be empty string or space only!'
        }
        return body;
    },

    checkReviewRating(rating) {
        if (!rating) {
            throw 'Review rating is not provided!'
        }
        if (typeof rating !== 'string') {
            throw 'Invalid rating input!'
        }
        rating = parseFloat(rating);
        if (rating < 1 || rating > 5) {
            throw 'The review rating should be in range of 1-5 (inclusive)'
        }
        return rating;
    }
}