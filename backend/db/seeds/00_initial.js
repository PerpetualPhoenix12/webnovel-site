const crypto = require('crypto');
const bcrypt = require('bcrypt');
const tableNames = require('../../src/constants/tableNames.js');

exports.seed = async (knex) => {
  await Promise.all(Object.keys(tableNames).map((table_name) => knex(table_name).del()));

  const password = crypto.randomBytes(15).toString('hex');

  const user = {
    id: 1,
    email: 'coolestreader@gmail.com',
    username: 'CoolestReader',
    password: await bcrypt.hash(password, 12),
  };

  await knex(tableNames.users).insert(user);
};
