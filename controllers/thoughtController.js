const { Thought } = require('../models');
const c = require('../utils/helpers').c

module.exports = {
    //create a thought
    createThought({ body }, res) {
        console.log(c('body', 'r'), body)
        Thought.create(body)
            .then(data => res.json(data))
            .catch(err => res.status(400).json(err));
    },

    // get all thoughts
    getThoughts(req, res) {
        Thought.find({})
            .select('-__v') //exclude the __v field
            .sort({ _id: -1 }) //sort by newest
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }, 

    // get thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
}