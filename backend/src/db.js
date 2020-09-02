const knex = require('knex');
const knexConfig = require('../knexfile.js');

const environment = process.env.NODE_ENV;
const connectionConfig = knexConfig[environment] || knexConfig.development;

const connection = knex(connectionConfig);

module.exports = connection;
