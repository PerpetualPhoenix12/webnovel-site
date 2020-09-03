const { Model } = require('objection');
const tableNames = require('../../constants/tableNames.js');
const schema = require('./users.schema.json');

class User extends Model {
  static get tableName() {
    return tableNames.users;
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = User;
