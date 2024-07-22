const date = require('date-and-time');
const colors = require('colors');

function c(str='null', color = 'g'){ // this function is to color the console.log
    const opt = { r: 'red', g: 'green', y: 'yellow', b: 'blue'}
    return colors[opt[color]](str) 
}

async function findItem(obj, val, key = '_id') {
    const modelName = Object.keys(obj)[0]
    const model = obj[modelName]
    try {
        if (!val) {
            console.log(c('No value provided','r'), val)
            return { 
                exist: false, 
                message: `No ${modelName} ${key} provided in the url!` 
            }
        }
        
        const item = await model.findOne({ [key]: val }).select('-__v')
        if (!item) {
            return { 
                exist: false, 
                message: `No ${modelName} found with this ${key}!` 
            }
        }

        return {...item._doc, exist: true} 
    } catch (err) {
        console.log(c(`Error. No ${modelName} found with this key:`, 'r'), key)
        return { 
            exist: false, 
            message: `Error. No ${modelName} found with this ${key}` 
        }
    }
}

module.exports = { 
    c,
    findItem,
    formatDate: ()=> date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
};