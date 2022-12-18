const {ObjectId} = require('mongodb');

module.exports = {

    checkUsername(name) {
        if (!name) {
            throw 'Username is not provided!'
        }
        if (typeof name !== 'string') {
            throw 'Username should be a string!'
        }
        name = name.trim();
        if (name === '') {
            throw 'Username cannot be empty string or spaces only!'
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
        const ratingRegex = /^[1-5]$/;
        if (!ratingRegex.test(rating)) {
            throw 'Review rating must be an integer from 1 to 5 (1 is lowest, 5 is highest)!'
        }
        return rating;
    },

    createDateTime() {
        // create current date
        const today = new Date();
        let yyyy = today.getFullYear();
        let mm = today.getMonth()+1;
        let dd = today.getDate();
        let hr = today.getHours();
        let min = today.getMinutes();
        let sec = today.getSeconds();
        //when mm or dd has only one number add 0 in front of it
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (dd < 10) {
            dd = '0' + dd;
        }
        return `${mm}/${dd}/${yyyy}  ${hr}:${min}:${sec}`;
    },

    existypestring(input) {
        if (typeof input !=='string' ||input.trim().length === 0) {
            throw 'Input has to be a string and it cannot be an empty string or string with just spaces'
        }
        input=input.trim()
        return input;
    },

    checkPostTitle(title) {
        if (title === '') {
            throw 'Post title cannot be empty string or space only!'
        }
        if(title.trim().length<2) throw 'Title must be at least two characters';
        title = title.trim();
        if(title.length > 30) throw 'Title cannot be more than 30 characters';
        let pattern = /[^a-zA-Z0-9\s-\'.]/g;
        let result = pattern.test(title);
        if(result===true){
            throw 'Title can only contain letters a-z, A-Z , numbers, space and .\'-'
         }
        return title;
    },

    checkId_j(id) {
        if (!ObjectId.isValid(id)) throw 'invalid object ID';
        return id;
      },

    checktradeStatus(tradeStatus){
        tradeStatus=parseInt(tradeStatus,10);
        if(tradeStatus!==0||tradeStatus!==1 ||tradeStatus!==2){
            throw "Invalid Status"
        }
    },
}