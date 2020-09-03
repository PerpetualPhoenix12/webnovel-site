const jwt = require('jsonwebtoken');

function sign(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    }, (err, token) => {
      if (err) return reject(err);
      return resolve(token);
    });
  });
}

module.exports = { sign };
