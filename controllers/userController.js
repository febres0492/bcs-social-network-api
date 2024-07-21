const { User, Thought } = require('../models');
const c = require('../utils/helpers').c
const f = require('../utils/helpers')

module.exports = {

    //create a new user
    createUser({ body }, res) {
        console.log(c('body', 'r'), body)
        User.create(body)
            .then(data => res.json(data))
            .catch(err => res.status(400).json(err));
    },

    //get all users
    getAllUser(req, res) {
        User.find({})
            .select('-__v') 
            .sort({ _id: -1 }) 
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get user by id
    async getUserById({ params }, res) {
        try {
            const currentUser = await f.findItem({ User }, params.userId)
            if(currentUser.null) { return res.status(404).json(currentUser) }
            
            res.json(currentUser)
        } catch (err) {
            console.log(err)
            res.status(400).json(err)
        }
    },

    // update user by id
    async updateUser({ params, body }, res) {
        try {
            const currentUser = await f.findItem({ User }, params.userId)
            if(currentUser.null) { return res.status(404).json(currentUser) }

            const dbUserData = await User.findOneAndUpdate(
                { _id: params.userId }, 
                body, 
                { new: true, runValidators: true }
            )

            res.json(dbUserData)
        } catch (err) {
            res.status(400).json(err)
        }
    },

    //delete user by id and their associated thoughts
    async deleteUser({ params }, res) {
        try {
            const currentUser = await f.findItem({ User }, params.userId)
            if (currentUser.null) { return res.status(404).json(currentUser) }

            const dbUserData = await User.findOneAndDelete({ _id: params.userId })
            
            // deleting user thoughts
            await Thought.deleteMany({ userId: params.userId })

            // removing the deleted user from other users friends lists
            await User.updateMany(
                { friends: params.userId },
                { $pull: { friends: params.userId } }
            )

            res.json(dbUserData)
        } catch (err) {
            res.status(400).json(err)
        }
    },

    //add friend to user
    async addFriend({ params }, res) {
        try {
            // get current user
            const currentUser = await f.findItem({User}, params.userId)
            if(currentUser.null) { return res.status(404).json(currentUser) }

            const potentialFriend = await f.findItem({User}, params.friendId )
            if(potentialFriend.null) { return res.status(404).json({...potentialFriend, message: 'No Friend found with this Id'}) }

            // checking if the user is trying to add themselves as a friend
            if (currentUser._id.toString() === potentialFriend._id.toString()) {
                return res.status(400).json({ message: 'You cannot be friends with yourself!' })
            }

            // Check if the friendId is already in the user's friends list
            const userFriendList = currentUser.friends.map(friend => friend.toString())
            if (userFriendList.includes(params.friendId)) {
                return res.status(400).json({ message: 'You are already friends with this user!' })
            }
            
            // adding friendId to the user's friends list
            const dbUserData = await User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { friends: params.friendId } },
                { new: true }
            )

            res.json(dbUserData)
        } catch (err) {
            res.status(400).json(err)
        }
    },

    //remove friend from user
    async removeFriend({params}, res) {
        try {
            const currentUser = await f.findItem({User}, params.userId)
            if(currentUser.null) { return res.status(404).json(currentUser) }

            // checking if the friendId is not in the users friends list
            const userFriendList = currentUser.friends.map(friend => friend.toString())
            if (!userFriendList.includes(params.friendId)) {
                return res.status(400).json({ message: 'You are not friends with this user!' })
            }

            // removing friendId from the user's friends list
            const dbUserData = await User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { friends: params.friendId } },
                { new: true }
            )

            res.json(dbUserData)
        } catch (err) {
            res.status(400).json(err)
        }
    }
}
