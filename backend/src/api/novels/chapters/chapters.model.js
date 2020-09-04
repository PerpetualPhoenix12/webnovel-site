const { Model } = require('objection');
const tableNames = require('../../../constants/tableNames.js');

class Chapter extends Model {
  static get tableName() {
    return tableNames.chapters;
  }
}

module.exports = Chapter;
