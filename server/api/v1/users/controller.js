const User = require('./model');

const noWorker = require('../../../hash/no-worker');
const worker = require('../../../hash/worker');

exports.signup = (req, res, next) => {
  const {
    body,
  } = req;
  const cUser = new User(body);
  const email = body.email;
  User
    .findOne({
      email,
    })
    .exec()
    .then((user) => {
      if (!user) {
        cUser.save()
          .then((created) => {
            res.json({
              success: true,
              item: created,
            });
          });
      } else {
        next();
      }
    })
    .catch((error) => {
      next(new Error(error));
    });
};

exports.all = (req, res, next) => {

  
console.log(noWorker.MD5('habr'));
console.log(noWorker.SHA256('habr'));

console.log(worker.MD5('habr'));
console.log(worker.SHA256('habr'));

  User.find().then((users) => {
    res.json({
      success: true,
      item: users,
    });
  })
  .catch((error) => {
    next(new Error(error));
  });
};

exports.signin = (req, res, next) => {
  const {
    body,
  } = req;
  const {
    email,
    password,
  } = body;
  User
    .findOne({
      email,
    })
    .exec()
    .then((user) => {
      if (user && user.password === password) {
        res.json({
          success: true,
          item: user,
        });
      } else {
        next();
      }
    })
    .catch((error) => {
      next(new Error(error));
    });
};
