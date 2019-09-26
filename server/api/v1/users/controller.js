const User = require('./model');
const hash = require('../../../hash/hash');

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

exports.all = async (req, res, next) => {
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
