const router = require('express').Router();
const f = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/')
    .get(f.getAllThoughts)
    .post(f.createThought)
    
// /api/thoughts/:thoughtId
router.route('/:thoughtId')
    .get(f.getThoughtById)

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(f.addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
// router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;