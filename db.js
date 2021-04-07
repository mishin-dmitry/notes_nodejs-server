require("dotenv").config();

const { client, connection } = require('./knexfile');
const { nanoid } = require("nanoid");

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

const findUserByName = async (username) => {
  return knex("users")
    .where({ username })
    .limit(1)
    .then(result => result[0]);
};

const createSession = async (userId) => {
  const sessionId = nanoid();

  await knex("session").insert({
    user_id: userId,
    session_id: sessionId
  });

  return sessionId;
};

const deleteSession = async (sessionId) => {
  knex("sessions")
    .where({ session_id: sessionId })
    .delete();
}

const createUser = async ({ username, password }) => {
  const [id] = await knex("users")
    .insert({ username, password })
    .returning("id");

  return id;
};

module.exports = {
  findUserBySessionId,
  findUserByName,
  createSession,
  deleteSession,
  createUser
}