require("dotenv").config();
const { client, connection } = require('./knexfile');

// const { nanoid } = require("nanoid");

const knex = require("knex")({ client, connection });

const getUserById = async (userId) => {
  return knex("users")
    .where({ id: userId })
    .limit(1)
    .then(result => result[0]);
};

const findUserBySessionId = async (sessionId) => {
  const session = await knex("sessions")
    .select("user_id")
    .where({ id: sessionId })
    .limit(1)
    .then(result => result[0]);

  return session && getUserById(session['user_id'])
};

module.exports = {
  findUserBySessionId
}
