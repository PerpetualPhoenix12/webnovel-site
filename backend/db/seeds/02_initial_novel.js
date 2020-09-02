const tableNames = require('../../src/constants/tableNames.js');

exports.seed = async (knex) => {
  const novel = {
    id: 1,
    title: 'Library of Heaven\'s Path',
    author_id: 1,
    synopsis: 'Traversing into another world, Zhang Xuan finds himself becoming an honorable teacher. Along with his transcension, a mysterious library appears in his mind. As long as it is something he has seen, regardless of whether it is a human or an object, a book on its weaknesses will be automatically compiled in the library. Thus, he becomes formidable. “Emperor Zhuoyang, why do you detest wearing your underwear so much? As an emperor, can’t you pay a little more attention to your image?” “Fairy Linglong, you can always look for me if you find yourself unable to sleep at night. I am skilled in lullabies!” “And you, Demon Lord Qiankun! Can you cut down on the garlic? Are you trying to kill me with that stench?” This is an incredible story about teachers and students, grooming and guiding the greatest experts in the world!',
  };

  await knex(tableNames.novels).insert(novel);
};
