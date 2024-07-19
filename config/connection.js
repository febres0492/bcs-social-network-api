const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGODB_URI || `mongodb://localhost/${process.env.DB_NAME}`,
);

module.exports = mongoose.connection;


