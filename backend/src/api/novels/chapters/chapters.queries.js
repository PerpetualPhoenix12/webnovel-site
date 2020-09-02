const db = require('../../../db.js');
const tableNames = require('../../../constants/tableNames.js');

module.exports = {
  all(novel_id) {
    return db(tableNames.chapters)
      .where({
        novel_id,
      });
  },
  get(novel_id, number) {
    return db(tableNames.chapters)
      .where({
        novel_id,
        number,
      })
      .first();
  },
};
