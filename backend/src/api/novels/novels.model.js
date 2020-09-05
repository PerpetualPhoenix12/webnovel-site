const { Model } = require('objection');
const tableNames = require('../../constants/tableNames.js');
const schema = require('./novels.schema.json');

class Novel extends Model {
  static get tableName() {
    return tableNames.novels;
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Novel;
