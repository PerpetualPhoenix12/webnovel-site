const db = require('../../../db.js');
const tableNames = require('../../../constants/tableNames.js');

module.exports = {
  async all(novel_id) {
    return db(tableNames.chapters)
      .where({
        novel_id,
      });
  },
  async get(novel_id, number) {
    const [chapter] = await db(tableNames.chapters)
      .where({
        novel_id,
        number,
      });
    return chapter;
  },
};
