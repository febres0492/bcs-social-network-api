const router = require('express').Router();
const f = require('../../controllers/userController');

// /api/users
router.route('/')
    .get(f.getUser)
    .post(f.createUser);

// /api/users/:userId
router.route('/:userId')
    .get(f.getUserById)
    .put(f.updateUser)
    .delete(f.deleteUser);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId')
    .post(f.addFriend)
    .delete(f.removeFriend);

module.exports = router;
