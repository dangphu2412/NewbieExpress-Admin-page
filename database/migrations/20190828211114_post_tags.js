exports.up = function(knex) {
    return knex.schema 
      .createTable('post_tags', function (table) {
        table.increments('id').primary();
        table.integer('post_id').unsigned().notNullable();
        table.foreign('post_id').references('id').inTable('posts').onDelete('CASCADE');
        table.integer('tag_id').unsigned().notNullable();
        table.foreign('tag_id').references('id').inTable('tags').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
  };
  
exports.down = function(knex) {
    return knex.schema
      .dropTable('post_tags');
  };
exports.config = { transaction: false };