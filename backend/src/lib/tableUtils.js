const tableNames = require('../constants/tableNames.js');

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
    .notNullable()
    .onDelete('cascade');
}

function massReferences(table_names, table) {
  table_names.forEach((table_name) => references(tableNames[table_name], table));
}

async function createUpdatedAtFunction(knex) {
  await knex.raw(`CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
     NEW.updated_at = now(); 
     RETURN NEW;
  END;
  $$ language 'plpgsql';`);
}

async function addUpdateTrigger(knex) {
  Object.keys(tableNames).forEach(async (table) => {
    await knex.raw(`CREATE TRIGGER update_${table}_changetimestamp BEFORE UPDATE
    ON ${table} FOR EACH ROW EXECUTE PROCEDURE 
    update_updated_at();`);
  });
}

module.exports = {
  addDefaultColumns,
  createNameTable,
  references,
  massReferences,
  createUpdatedAtFunction,
  addUpdateTrigger,
};
