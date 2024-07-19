const { User } = require('../models');
const c = require('../utils/helpers').c

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

};
