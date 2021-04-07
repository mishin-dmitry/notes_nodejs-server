exports.up = function(knex) {
  return knex.schema.createTable("notes", (table) => {
    table.increments("id");
    table.integer("user_id");
    table.foreign("user_id").references("users.id");
    table.string("caption");
    table.string("text");
    table.boolean("is_archived");
    table.bigInteger("created");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("notes");
};
