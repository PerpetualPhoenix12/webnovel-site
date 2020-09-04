const { Model } = require('objection');
const tableNames = require('../../constants/tableNames.js');

class Novel extends Model {
  static get tableName() {
    return tableNames.novels;
  }
}

module.exports = Novel;
