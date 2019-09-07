exports.up = function(knex) {
    return knex.schema
    .createTable('tags', function(table) {
      table.increments('id').primary();
      table.string('tag_name',255).notNullable();
      table.string('slug',255).notNullable();
    })
};

exports.down = function(knex) {
   return knex.schema
    .dropTable('tags');
};
