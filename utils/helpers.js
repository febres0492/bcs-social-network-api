const date = require('date-and-time');

function c(str='null', color = 'g'){ // this function is to color the console.log
    const colors = require('colors');
    const opt = { r: 'red', g: 'green', y: 'yellow', b: 'blue'}
    return colors[opt[color]](str) 
}

module.exports = { 
    c,
    formatDate: ()=> date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
};