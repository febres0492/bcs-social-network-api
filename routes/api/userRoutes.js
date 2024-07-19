const router = require('express').Router();
const f = require('../../controllers/userController');

// /api/users
router.route('/')
    .get(f.getUser)
    .post(f.createUser);



// /api/users/:userId
router.route('/:userId')
    .get(f.getUserById);

module.exports = router;
