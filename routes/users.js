const express = require('express');
const router = express.Router();
const data = require('../data');


const usersData = data.users;


router.route('/:userId').get(async (req, res) => {
        let userId = req.params.userId;

        //validation check


        try{
            const user = await usersData.getUserById(userId);
            res.status(200).json(user);
        }catch (e) {
            res.status(500).json({Error: e});
        }

    })


router.route('/').post(async (req, res) => {

    const requestUser = req.body;

    //validation check


    try{
        const {name, email, hashed_password} = requestUser;
        const newUser = await usersData.createUser(name, email, hashed_password);
        res.status(200).json(newUser);
    }catch (e){
        res.status(500).json({Error: e});
    }
})


module.exports = router;
