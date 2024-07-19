const router = require('express').Router();
const userRoutes = require('./userRoutes');
const thoughRoutes = require('./thoughtRoutes');

router.use('/thoughts', thoughRoutes);
router.use('/users', userRoutes);

console.log('rotes:', '/users', '/thoughts', );

module.exports = router;
