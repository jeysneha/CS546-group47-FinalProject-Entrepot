const express = require('express');
const router = express.Router();
const data = require('../data');
const {ObjectId} = require('mongodb');
const postData = data.posts;