exports.up = function(knex) {
    return knex.schema
    .createTable('posts', function(table) {
      table.increments('id').primary();
      table.string('title',255).notNullable();
      table.string('slug',255).notNullable();
      table.text('content', 'longtext').notNullable();
      table.integer('category_id').unsigned().notNullable();
      table.foreign('category_id').references('id').inTable('category').onDelete('CASCADE');
      table.integer('author_id').unsigned().notNullable();
      table.foreign('author_id').references('id').inTable('users').onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  };
  
  exports.down = function(knex) {
    return knex.schema
    .dropTable('posts');
  };
  
  exports.config = { transaction: false };