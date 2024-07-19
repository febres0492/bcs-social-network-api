const { User, Application } = require('../models');
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
            // .select('-__v') //exclude the __v field
            // .sort({ _id: -1 }) 
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }

};
