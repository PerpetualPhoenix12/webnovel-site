const tableNames = require('../../src/constants/tableNames.js');

exports.seed = async (knex) => {
  const team = [
    {
      table_name: tableNames.authors,
      data: {
        id: 1,
        name: 'Heng Sao Tian Ya',
      },
    },
    {
      table_name: tableNames.editors,
      data: {
        id: 1,
        name: 'Millman',
      },
    },
    {
      table_name: tableNames.translators,
      data: {
        id: 1,
        name: 'StarveTheLich',
      },
    },
  ];

  await Promise.all(team.map((row) => knex(row.table_name).insert(row.data)));
};
