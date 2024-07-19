const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname);
const jsFiles = files.filter((file) => file.endsWith('.js') && file !== 'index.js');

const models = {};

jsFiles.forEach((file) => {
    const model = require(path.join(__dirname, file));
    models[model.modelName] = model;
});

console.log('models', models);

module.exports = models;

