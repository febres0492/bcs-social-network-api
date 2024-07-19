const router = require('express').Router();
const {
    getUsers,
    getSingleUser,
    createUser,
} = require('../../controllers/userController');

// /api/users
router.route('/')
    .get((req, res) => {
        res.send('Hello World');
    } )
    .post((req, res) => {
        console.log(req.body);
        res.json(req.body);
    } );

// /api/users/:userId
// router.route('/:userId').get(getSingleUser);

module.exports = router;
