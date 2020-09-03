const knex = require('knex');
const { Model } = require('objection');
const knexConfig = require('../knexfile.js');

const environment = process.env.NODE_ENV;
const connectionConfig = knexConfig[environment] || knexConfig.development;

const connection = knex(connectionConfig);

Model.knex(connection);

module.exports = connection;
