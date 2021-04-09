exports.up = function(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("username", 255).notNullable().unique();
    table.string("password").notNullable();
    table.string("last_login");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
