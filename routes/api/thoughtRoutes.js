const router = require('express').Router();
const f = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/')
    .get(f.getAllThoughts)
    .post(f.createThought)
    
// /api/thoughts/:thoughtId
router.route('/:thoughtId')
    .get(f.getThoughtById)
    .put(f.updateThought)
    .delete(f.deleteThought)

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions')
    .post(f.addReaction)
    .delete(f.removeReaction)

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(f.removeReaction)

module.exports = router;