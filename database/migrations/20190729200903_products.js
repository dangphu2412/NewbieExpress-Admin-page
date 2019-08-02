exports.up = function(knex) {
    return knex.schema
    .createTable('products', function (table) {
      table.increments('id').primary();
      table.string('pr_name',255).notNullable();
      table.string('slug',255).notNullable();
      table.integer('price').unsigned().notNullable();
      table.string('description',255).notNullable();
      table.integer('product_type_id').unsigned().notNullable();
      table.foreign('product_type_id').references('id').inTable('product_types');
      table.integer('author_id').unsigned().notNullable();
      table.foreign('author_id').references('id').inTable('users');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
    };

exports.down = function(knex) {
    return knex.schema
    .dropTable('products');
};

exports.config = { transaction:false };
