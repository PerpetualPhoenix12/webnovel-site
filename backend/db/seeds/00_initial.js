const crypto = require('crypto');
const bcrypt = require('bcrypt');
const tableNames = require('../../src/constants/tableNames.js');

exports.seed = async (knex) => {
  await Promise.all(Object.keys(tableNames).map((table_name) => knex(table_name).del()));

  // const password = crypto.randomBytes(15).toString('hex');
  const password = 'MuffinsRG00D:'

  const user = {
    id: 1,
    email: 'coolestreader@gmail.com',
    username: 'CoolestReader',
    password: await bcrypt.hash(password, 12),
  };

  const deleted_user = {
    id: 2,
    email: 'notacoolreader@gmail.com',
    username: 'NotACoolReader',
    password: await bcrypt.hash(password, 12),
    deleted_at: '2020-09-02 19:33:05.984249+00',
  };

  await Promise.all([
    knex(tableNames.users).insert(user),
    knex(tableNames.users).insert(deleted_user)]);
};
