const tableNames = require('../../src/constants/tableNames.js');

exports.seed = async (knex) => {
  const chapters = [
    {
      id: 1,
      novel_id: 1,
      title: 'Swindler',
      content: '“Swindler! Great swindler!” An enraged roar can be heard and the sound of footsteps on a bluestone pavement by someone escaping could be heard. Zhang Xuan stretches out his both hands helpless, “I am not a swindler, I am a teacher of the academy… I only want to make you my student! Besides that, do you have to add a ‘great’ while saying that I am a swindler? You make it sound as though I am some unpardonable criminal…”',
      number: 1,
      editor_id: 1,
      translator_id: 1,
    },
    {
      id: 2,
      novel_id: 1,
      title: 'Shameless',
      content: 'After looking around for awhile longer, Zhang Xuan realizes that all of the books in the library are just like the moon reflected in the water, it is impossible to retrieve them from the shelves. Thus, he loses interest and his consciousness retreats from his mind. “Time to eat lunch. After lunch, I will think of a way to coax another two more.”',
      number: 2,
      editor_id: 1,
      translator_id: 1,
    },
  ];

  await Promise.all(chapters.map((chapter) => knex(tableNames.chapters).insert(chapter)));
};
