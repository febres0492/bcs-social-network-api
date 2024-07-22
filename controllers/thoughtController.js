const { User, Thought } = require('../models');
const c = require('../utils/helpers').c
const f = require('../utils/helpers')

module.exports = {
    //create a thought
    async createThought({ body }, res) {
        try {
            const user = await f.findItem({ User }, body.userId )
            if (user.null) { return res.status(404).json(user) }

            const thought = await Thought.create(body);

            // adding the thought to the user thoughts
            await User.findByIdAndUpdate(
                body.userId, 
                { $push: { thoughts: thought._id } }, 
                { new: true, runValidators: true }
            );

            res.json(thought);
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: "An error occurred" })
        }
    },

    async getAllThoughts(req, res) {
        try {
            let dbThoughtData = await Thought.find({}).select('-__v').sort({ _id: -1 }); 

            const thoughts = await f.addUsernameToThoughts(dbThoughtData)

            res.json(thoughts);
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: "An error occurred" })
        }
    },

    // get thought by id
    async getThoughtById({ params }, res) {
        try {
            let thought = await f.findItem({ Thought }, params.thoughtId )
            if (thought.null) { return res.status(404).json(thought) }

            thought = await f.addUsernameToThoughts(thought)
            res.json(thought)
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: "An error occurred" })
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
            console.error(err)
            res.status(500).json({ message: "An error occurred" })
        }
    },

    // delete thought by id
    async deleteThought({ params }, res) {
        try {
            const thought = await f.findItem({ Thought }, params.thoughtId );
            if (thought.null) { return res.status(404).json(thought) }

            const dbThoughtData = await Thought.findOneAndDelete({ _id: params.thoughtId });

            res.json(dbThoughtData);
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: "An error occurred" })
        }
    },

    // add reaction to thought
    async addReaction({ params, body }, res) {
        try {
            const thought = await f.findItem({ Thought }, params.thoughtId )
            if (thought.null) { return res.status(404).json(thought) }

            const userReacting = await f.findItem({ User }, body.userId )
            if (userReacting.null) { return res.status(404).json(userReacting) }

            const dbThoughtData = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $addToSet: { reactions: body } },
                { new: true, runValidators: true }
            )

            res.json(dbThoughtData)
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: "An error occurred" })
        }
    },

    // remove reaction from thought
    async removeReaction({ params, body }, res) {
        try {
            const thought = await f.findItem({ Thought }, params.thoughtId )
            if (thought.null) { return res.status(404).json(thought) }

            //checking if the reaction exists
            const reaction = thought.reactions.id(body.reactionId)
            if (!reaction) { return res.status(404).json({ message: 'No reaction found with this id!' }) }

            const dbThoughtData = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $pull: { reactions: { _id: body.reactionId } } },
                { new: true }
            )

            res.json(dbThoughtData)
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: "An error occurred" })
        }
    } 
}