let { User } = require('./../models/user');

let authenticate = (req, res, next) => {
  let token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      // res.status(401).send();
      return Promise.reject(); // a better approach compared to the above line
    }
    // res.send(user);
    req.user = user;
    req.token = token
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};
