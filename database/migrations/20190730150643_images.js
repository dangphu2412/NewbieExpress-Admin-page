exports.up = function(knex) {
  return knex.schema
  .createTable('images', function(table) {
    table.increments('id').primary();
    table.string('url',255).notNullable();
    table.integer('product_id').unsigned().notNullable();
    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTable('images');
};

exports.config = { transaction:false };

