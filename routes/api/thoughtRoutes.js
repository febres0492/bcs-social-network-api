const router = require('express').Router();
const f = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/')
    .get(f.getThoughts)
    .post(f.createThought)
    
// /api/thoughts/:thoughtId
router.route('/:thoughtId')
    .get(f.getThoughtById)

// /api/thoughts/:thoughtId/reactions
// router.route('/:thoughtId/reactions').post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
// router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;