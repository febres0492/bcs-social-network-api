const { User, Thought } = require('../models');
const c = require('../utils/helpers').c
const f = require('../utils/helpers')

module.exports = {

    //create a new user
    async createUser({ body }, res) {
        try {

            // in the Acceptance Criteria the User model username is has to be unique 
            // so this section is checking if the username is already in use
            const userName = await f.findItem({ User }, body.username, 'username')
            const email = await f.findItem({ User }, body.email, 'email')

            if (userName.exist || email.exist) { 
                const userNameMessage = userName.exist ? 'username is already in use. Try a diffenrent username!' : ''
                const emailMessage = email.exist ? 'email is already in use. Try a diffenrent email!' : ''
                return res.status(400).json(
                { 
                    success: false,
                    message: [userNameMessage, emailMessage].filter(val => val !== '')
                }
            ) }

            const data = await User.create(body)
            res.json(data)
        } catch (err) {
            console.log(err)
            res.status(400).json({ message: 'An error occurred' })
        }
    },

    //get all users
    getAllUser(req, res) {
        User.find({})
            .select('-__v') 
            .sort({ _id: -1 }) 
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json({ message: 'An error occurred' })
            })
    },

    // get user by id
    async getUserById({ params }, res) {
        try {
            const currentUser = await f.findItem({ User }, params.userId)
            if(!currentUser.exist) { return res.status(404).json({...currentUser, success: false}) }
            
            res.json(currentUser)
        } catch (err) {
            console.log(err)
            res.status(400).json({ message: 'An error occurred' })
        }
    },

    // update user by id
    async updateUser({ params, body }, res) {
        try {
            const currentUser = await f.findItem({ User }, params.userId)
            if(!currentUser.exist) { return res.status(404).json({...currentUser, success: false}) }

            const dbUserData = await User.findOneAndUpdate(
                { _id: params.userId }, 
                body, 
                { new: true, runValidators: true }
            )

            res.json(dbUserData)
        } catch (err) {
            res.status(400).json({ message: 'An error occurred' })
        }
    },

    //delete user by id and their associated thoughts
    async deleteUser({ params }, res) {
        try {
            const currentUser = await f.findItem({ User }, params.userId)
            if (!currentUser.exist) { return res.status(404).json({...currentUser, success: false}) }

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
            res.status(400).json({ message: 'An error occurred' })
        }
    },

    //add friend to user
    async addFriend({ params }, res) {
        try {
            // get current user
            const currentUser = await f.findItem({User}, params.userId)
            if(!currentUser.exist) { return res.status(404).json({...currentUser, success: false}) }

            const potentialFriend = await f.findItem({User}, params.friendId )
            if(!potentialFriend.exist) { 
                return res.status(404).json({...potentialFriend, message: 'No Friend found with this Id', success: false}) 
            }

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
            res.status(400).json({ message: 'An error occurred' })
        }
    },

    //remove friend from user
    async removeFriend({params}, res) {
        try {
            const currentUser = await f.findItem({User}, params.userId)
            if(!currentUser.exist) { return res.status(404).json({...currentUser, success: false}) }

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
            res.status(400).json({ message: 'An error occurred' })
        }
    }
}
