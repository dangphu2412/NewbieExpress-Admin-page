const env = 'development';
const config = require('../knexfile');
const knex = require('knex')(config[env]);

module.exports = knex;