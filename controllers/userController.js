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
    getUser(req, res) {
        User.find({})
            // .populate({ path: 'applications', select: '-__v' })
            .select('-__v') //exclude the __v field
            .sort({ _id: -1 }) 
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //get user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.userId })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //update user by id
    updateUser({ params, body }, res ) {
        User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    //delete user by id and their associated thoughts
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.userId })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                // After successfully deleting the user, delete their thoughts
                Thought.deleteMany({ userId: params.userId })
                    .then(() => {
                        res.json(dbUserData);
                    })
                    .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
    },

    //add friend to user
    async addFriend({ params }, res) {
        let potentialFriend, currentUser;
        try {
            // get current user
            currentUser = await f.findUser({User, ...params})
            if(currentUser.null) { return res.status(404).json({ message: currentUser.message }); }

            potentialFriend = await f.findUser({User, userId: params.friendId, message: 'No friend found with this id!' })
            if(potentialFriend.null) { return res.status(404).json({ message: potentialFriend.message }); }

            if (currentUser._id.toString() === potentialFriend._id.toString()) {
                return res.status(400).json({ message: 'You cannot be friends with yourself!' });
            }

            // Check if the friendId is already in the user's friends list
            const userFriendList = currentUser.friends.map(friend => friend.toString());
            if (userFriendList.includes(params.friendId)) {
                return res.status(400).json({ message: 'You are already friends with this user!' });
            }
            
            // adding friendId to the user's friends list
            const dbUserData = await User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { friends: params.friendId } },
                { new: true }
            );

            res.json(dbUserData);
        } catch (err) {
            if(!currentUser) {
                return res.status(404).json({ message: 'No user found with this id!' });
            }
            if(!potentialFriend) {
                return res.status(404).json({ message: 'No Friend found with this id!' });
            }
            res.status(400).json(err);
        }
    },

    //remove friend from user
    async removeFriend({params}, res) {
        let potentialFriend, currentUser;
        try {
            // get current user
            currentUser = await f.findUser({User, ...params})
            console.log(c('currentUser', 'r'), currentUser)
            if(currentUser.null) { return res.status(404).json({ message: currentUser.message }); }

            potentialFriend = await f.findUser({User, userId: params.friendId, message: 'No friend found with this id!' })
            console.log(c('potentialFriend', 'r'), potentialFriend)
            if(potentialFriend.null) { return res.status(404).json({ message: potentialFriend.message }); }

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

            res.json(dbUserData);
        } catch (err) {

            if(!currentUser) {
                return res.status(404).json({ message: 'No user found with this id!' });
            }
            if(!potentialFriend) {
                return res.status(404).json({ message: 'No Friend found with this id!' });
            }
            res.status(400).json(err);
        }
    }
}
