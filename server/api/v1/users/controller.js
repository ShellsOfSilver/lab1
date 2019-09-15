const User = require('./model');
const napa = require("napajs");

const hash = require('../../../hash/hash');

const NUMBER_OF_WORKERS = 5;
let zone = napa.zone.create('zone', { workers: NUMBER_OF_WORKERS });

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
  const TEST_ITERATIONS = 1000;
  const text = 'habr';

  let startTime = Date.now();
  for (let i = 0; i < TEST_ITERATIONS; i++) {
    hash.MD5(text);
    hash.SHA256(text);
  }
  console.log('\n-----------\nsync test iterations: ' + TEST_ITERATIONS + ', timestamp: ' + (Date.now() - startTime));

  const promises = [];
  startTime = Date.now();
  for (let i = 0; i < TEST_ITERATIONS; i++) {
    promises.push(zone.execute((md5, sha256, text) => {
      md5(text);
      sha256(text);
    }, [hash.MD5, hash.SHA256, text]));
  }
  await Promise.all(promises);
  console.log('-----------\nnapajs test iterations: ' + TEST_ITERATIONS + ', timestamp: ' + (Date.now() - startTime) + ', number of workers: ' + NUMBER_OF_WORKERS);
  console.log('-----------\n');
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
