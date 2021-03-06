exports.up = function(knex) {
    return knex.schema 
      .createTable('users',function (table) {
          table.increments('id').primary();
          table.string('name',255).notNullable();
          table.string('username',255).notNullable();
          table.string('email',255).notNullable();
          table.string('password',255).notNullable();
          table.string('google_id',255);
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
  };
  
exports.down = function(knex) {
    return knex.schema
      .dropTable("users");
};
  
exports.config = { transaction:false };