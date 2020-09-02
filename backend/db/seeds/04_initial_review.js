const tableNames = require('../../src/constants/tableNames.js');

exports.seed = async (knex) => {
  const review = {
    id: 1,
    user_id: 1,
    novel_id: 1,
    content: 'Started off interesting but turned into like almost all Chinese novels. We have more chapters about a scammer and some women who thinks she\'s all that than we do him actually teaching. Doesn\'t help that our MC is the epitome of s*upid, Goes to shop "Oh forgot money" goes to book store asking for Cultivation manuals that was stated by him previously that it\'s hidden and not for sell.',
    rating: 2,
  };

  await knex(tableNames.reviews).insert(review);
};
