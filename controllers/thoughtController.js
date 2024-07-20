const { User, Thought } = require('../models');
const c = require('../utils/helpers').c
const f = require('../utils/helpers')

module.exports = {
    //create a thought
    async createThought({ body }, res) {
        try {
            const thought = await Thought.create(body);

            // adding the thought to the user thoughts
            await User.findByIdAndUpdate(
                body.userId, 
                { $push: { thoughts: thought._id } }, 
                { new: true, runValidators: true }
            );

            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },

    async getAllThoughts(req, res) {
        try {
            let dbThoughtData = await Thought.find({}).select('-__v').sort({ _id: -1 }); 

            // adding the username to each thought
            const thoughts = await Promise.all(
                dbThoughtData.map(async (thought) => {
                    const user = await f.findItem({ User }, thought.userId.toString() )
                    const obj = thought._doc
                    if(!user.null) { obj.username = user.username }
                    return obj
                })
            );

            res.json(thoughts);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },

    // get thought by id
    async getThoughtById({ params }, res) {
        try {
            const thought = await f.findItem({ Thought }, params.thoughtId )
            if (thought.null) { return res.status(404).json(thought) }

            res.json(thought)
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },

    // update thought by id
    async updateThought({ params, body }, res) {
        try {
            const thought = await f.findItem({ Thought },  params.thoughtId )
            if (thought.null) { return res.status(404).json(thought) }

            const dbThoughtData = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                body,
                { new: true, runValidators: true }
            );

            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }

            res.json(dbThoughtData);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    // delete thought by id
    async deleteThought({ params }, res) {
        try {
            const thought = await f.findItem({ Thought }, params.thoughtId );
            if (thought.null) { return res.status(404).json(thought) }

            const dbThoughtData = await Thought.findOneAndDelete({ _id: params.thoughtId });

            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }

            res.json(dbThoughtData);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    // add reaction to thought
    async addReaction({ params, body }, res) {
        try {
            const user = await f.findItem({ User }, body.userId )
            if (user.null) { return res.status(404).json(user) }

            const dbThoughtData = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $addToSet: { reactions: body } },
                { new: true, runValidators: true }
            );

            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }

            res.json(dbThoughtData);
        } catch (err) {
            res.json(err);
        }
    }
}