exports.up = function(knex) {
  return knex.schema.createTable("notes", (table) => {
    table.increments("id");
    table.integer("user_id");
    table.foreign("user_id").references("users.id");
    table.string("title");
    table.string("text");
    table.boolean("is_archived");
    table.boolean("is_demo");
    table.string("created");
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("notes");
};
