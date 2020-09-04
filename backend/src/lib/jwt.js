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

function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      return resolve(decoded);
    });
  });
}

module.exports = {
  sign,
  verify,
};

/*
* Sign out options:
* 1. Delete JWT from client's local storage (preferred)
* 2. Create token blacklist (but then it's no longer stateless)
* 3. Have multiple keys and shard the tokens into K groups.
*    Revoke the key for the shard that user is in,
*    thus signing out N/K users (who have to use their refresh tokens)
*/
