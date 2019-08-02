exports.up = (knex) => {
    return knex.schema
    .createTable('product_types', function (table) {
      table.increments('id').primary();
      table.string('type',255).notNullable();
      table.string('slug',255).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  };
  
exports.down = function (knex) {
    return knex.schema
    .dropTable("product_types");
  };
  
exports.config = { transaction:false };