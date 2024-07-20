const date = require('date-and-time');

function c(str='null', color = 'g'){ // this function is to color the console.log
    const colors = require('colors');
    const opt = { r: 'red', g: 'green', y: 'yellow', b: 'blue'}
    return colors[opt[color]](str) 
}

module.exports = { 
    c,
    formatDate: ()=> date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
    findUser: async (obj) => {
        try {
            if (!obj.userId) {
                console.log('No userId provided', obj.userId);
                return { null: true, message: 'No user id provided!' };
            }
            
            const currentUser = await obj.User.findOne({ _id: obj.userId }).select('-__v');
            if (!currentUser) {
                return { null: true, message: 'No user found with this id!' };
            }
            return currentUser 
        } catch (err) {
            return { null: true, message: 'Error. No user found with this id', error: err.toString() };
        }
    }
};