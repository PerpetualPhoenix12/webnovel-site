const db = require('../../db.js');
const tableNames = require('../../constants/tableNames.js');

module.exports = {
  all() {
    return db(tableNames.novels);
  },
  get(id) {
    return db(tableNames.novels)
      .where({
        id,
      })
      .first();
  },
};
