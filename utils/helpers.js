const User = require('../models/User')
const date = require('date-and-time');

function c(str='null', color = 'g'){ // this function is to color the console.log
    const colors = require('colors');
    const opt = { r: 'red', g: 'green', y: 'yellow', b: 'blue'}
    return colors[opt[color]](str) 
}

async function findItem(obj, id) {
    const key = Object.keys(obj)[0]
    const model = obj[key]
    try {
        if (!id) {
            console.log(c('No itemId provided','r'), id)
            return { null: true, message: `No ${key} id provided in the url!` }
        }
        
        const item = await model.findOne({ _id: id }).select('-__v')
        if (!item) {
            return { null: true, message: `No ${key} found with this id!` }
        }
        return item 
    } catch (err) {
        console.log(c(`Error. No ${key} found with this id`, 'r'), id)
        return { null: true, message: `Error. No ${key} found with this id` }
    }
}

module.exports = { 
    c,
    findItem,
    formatDate: ()=> date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
    addUsernameToThoughts: async (data)=> {
        const d = Array.isArray(data) ? data : [data];
        return await Promise.all(
            d.map(async (thought) => {
                const user = await findItem({ User }, thought.userId.toString());
                const obj = thought._doc;
                if (!user.null) { obj.username = user.username; }
                return obj;
            })
        );
    }
};