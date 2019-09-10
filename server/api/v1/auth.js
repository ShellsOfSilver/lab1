const authFailed = (req, res, next) => {
  res.json({
    success: false,
    message: 'Email or password does not match',
  });
};

const existFailed = (req, res, next) => {
  res.json({
    success: false,
    message: 'Email alredy exist',
  });
};

module.exports = {
  authFailed,
  existFailed
};
