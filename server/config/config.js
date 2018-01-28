const env = process.env.NODE_ENV || 'development';
console.log(`env ***********${env}`);

if (env === 'development' || env === 'test') {
  let config = require('./config.json');
  let envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
//
// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
//   //process.env.MONGODB_URI = 'mongodb://chao0716:Monkland4410@ds111568.mlab.com:11568/todo_api';
// } else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
//   //console.log(`MongoDB Path : ${process.env.MONGODB_URI}`);
// }
