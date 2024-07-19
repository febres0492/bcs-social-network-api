const router = require('express').Router();
const f = require('../../controllers/userController');

// /api/users
router.route('/')
    .get(f.getUser)
    .post(f.createUser);



// /api/users/:userId
// router.route('/:userId').get(getSingleUser);

module.exports = router;
