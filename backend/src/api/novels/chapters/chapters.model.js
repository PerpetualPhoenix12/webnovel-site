const { Model } = require('objection');
const tableNames = require('../../../constants/tableNames.js');
const schema = require('./chapters.schema.json');

class Chapter extends Model {
  static get tableName() {
    return tableNames.chapters;
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Chapter;
