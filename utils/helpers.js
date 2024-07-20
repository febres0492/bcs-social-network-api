const date = require('date-and-time');

function c(str='null', color = 'g'){ // this function is to color the console.log
    const colors = require('colors');
    const opt = { r: 'red', g: 'green', y: 'yellow', b: 'blue'}
    return colors[opt[color]](str) 
}

module.exports = { 
    c,
    formatDate: ()=> date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
    findItem: async (obj, id) => {
        const key = Object.keys(obj)[0]
        const model = obj[key]
        try {
            if (!id) {
                console.log(c('No itemId provided','r'), id);
                return { null: true, message: 'No item id provided!' };
            }
            
            const currentUser = await model.findOne({ _id: id }).select('-__v');
            if (!currentUser) {
                console.log(c('itemId','r'), id)
                return { null: true, message: `No ${key} found with this id!` };
            }
            return currentUser 
        } catch (err) {
            return { null: true, message: `Error. No ${key} found with this id`, error: err.toString() };
        }
    }
};