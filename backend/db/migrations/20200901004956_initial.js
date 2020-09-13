const tableNames = require('../../src/constants/tableNames.js');
const positions = require('../../src/constants/positions.js');
const tableUtils = require('../../src/lib/tableUtils.js');

exports.up = async (knex) => {
  await Promise.all([
    knex.schema.createTable(tableNames.users, (table) => {
      table.increments().notNullable();
      table.string('email').notNullable().unique();
      table.string('username').notNullable();
      table.string('password', 127).notNullable();
      table.string('avatar_url', 2000).defaultTo('https://tinyurl.com/y3f4r7m2');
      table.datetime('last_login');
      tableUtils.addDefaultColumns(table);
    }),
    positions.forEach((pos) => tableUtils.createNameTable(knex, tableNames[pos])),
    knex.schema.createTable(tableNames.novels, (table) => {
      table.increments().notNullable();
      table.string('title').notNullable().unique();
      table.string('synopsis', 1000).notNullable();
      table.integer('view_count').unsigned().defaultTo(0);
      table.string('cover_url', 2000).notNullable().defaultTo('https://tinyurl.com/y25ht8ml');

      tableUtils.references(tableNames.authors, table);
      tableUtils.addDefaultColumns(table);
    }),
    knex.schema.createTable(tableNames.chapters, (table) => {
      table.increments().notNullable();
      table.string('title', 30).notNullable();
      table.string('content', 5000).notNullable();
      table.integer('number').unsigned().notNullable();
      table.datetime('published_at');

      tableUtils.massReferences(['editors', 'translators', 'novels'], table);
      tableUtils.addDefaultColumns(table);
    }),
    knex.schema.createTable(tableNames.reviews, (table) => {
      table.increments().notNullable();
      table.string('content', 500).notNullable();
      table.integer('rating').unsigned().notNullable();

      tableUtils.massReferences(['users', 'novels'], table);
    }),
  ]);
  await tableUtils.createUpdatedAtFunction(knex);
  await tableUtils.addUpdateTrigger(knex);
};

exports.down = async (knex) => {
  await Promise.all(Object.keys(tableNames).map((table) => knex.schema.dropTable(table)));
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at;');
};
