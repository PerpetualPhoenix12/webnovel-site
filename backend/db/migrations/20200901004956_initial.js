const tableNames = require('../../src/constants/tableNames.js');
const positions = require('../../src/constants/positions.js');

function addDefaultColumns(table) {
  // Set created_at and updated_at columns
  table.timestamps(false, true);
  table.datetime('deleted_at');
}

async function createNameTable(knex, table_name) {
  return knex.schema.createTable(table_name, (table) => {
    table.increments().notNullable();
    table.string('name').unique();
    addDefaultColumns(table);
  });
}

function references(table_name, table) {
  table
    .integer(`${table_name.slice(0, -1)}_id`)
    .unsigned()
    .references('id')
    .inTable(table_name)
    .onDelete('cascade');
}

function massReferences(table_names, table) {
  table_names.forEach((table_name) => references(tableNames[table_name], table));
}

exports.up = async (knex) => {
  await Promise.all([
    knex.schema.createTable(tableNames.users, (table) => {
      table.increments().notNullable();
      table.string('email').notNullable().unique();
      table.string('username').notNullable();
      table.string('password', 127).notNullable();
      table.string('avatar_url', 2000).defaultTo('https://thebiem.com/wp-content/uploads/2018/04/Jiang_Chen-1-min-683x1024.png.webp');
      table.datetime('last_login');
      addDefaultColumns(table);
    }),
    positions.forEach((pos) => createNameTable(knex, tableNames[pos])),
    knex.schema.createTable(tableNames.novels, (table) => {
      table.increments().notNullable();
      table.string('title').notNullable();
      table.string('synopsis', 1000).notNullable();
      table.integer('view_count').unsigned().defaultTo(0);

      references(tableNames.authors, table);
      addDefaultColumns(table);
    }),
    knex.schema.createTable(tableNames.chapters, (table) => {
      table.increments().notNullable();
      table.string('title', 30).notNullable();
      table.string('content', 5000).notNullable();
      table.integer('number').unsigned().notNullable();
      table.datetime('published_at');

      massReferences(['editors', 'translators', 'novels'], table);

      addDefaultColumns(table);
    }),
    knex.schema.createTable(tableNames.reviews, (table) => {
      table.increments().notNullable();
      table.string('content', 500).notNullable();
      table.integer('rating').unsigned().notNullable();

      massReferences(['users', 'novels'], table);
    }),
  ]);
};

exports.down = async (knex) => {
  await Promise.all(Object.keys(tableNames).map((table) => knex.schema.dropTable(table)));
};
