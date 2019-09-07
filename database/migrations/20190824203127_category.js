exports.up = function(knex) {
    return knex.schema 
      .createTable('category', function (table) {
        table.increments('id').primary();
        table.string('category_name',255).notNullable();
        table.string('slug',255).notNullable();
      });
  };
  
exports.down = function(knex) {
    return knex.schema
      .dropTable('category');
  };
exports.config = { transaction: false };
