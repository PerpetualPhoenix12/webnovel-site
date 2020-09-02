const db = require('../../db.js');
const tableNames = require('../../constants/tableNames.js');

module.exports = {
  all() {
    return db(tableNames.novels);
  },
  async get(id) {
    const [novel] = await db(tableNames.novels)
      .where({
        id,
      });
    return novel;
  },
};
