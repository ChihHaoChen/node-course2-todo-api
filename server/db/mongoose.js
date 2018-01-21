
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp',
  {useMongoClient: true});
// to avoid the warning DeprecationWarning: `open()` is deprecated in mongoose >= 4.11.0
//mongoose.createConnection(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };
