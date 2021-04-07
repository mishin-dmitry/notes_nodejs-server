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
    .where({ session_id: sessionId })
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

  await knex("sessions").insert({
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

const getNotes = async (userId) => {
  const notes = await knex("notes").where({ user_id: userId });

  return notes.map(note => ({
    title: note.title,
    _id: note.id,
    isArchived: note['is_archived'],
    html: note.text,
    created: note.created
  }));
};

const createNote = async ({ userId, title, text }) => {
  const noteData = {
    user_id: userId,
    title,
    text,
    is_archived: false,
    created: new Date()
  }

  const note = await knex("notes")
    .insert(noteData)
    .returning("*")
    .then(result => result[0]);

  return {
    title: note.title,
    _id: note.id,
    isArchived: note['is_archived'],
    html: note.text,
    created: note.created
  };
};

module.exports = {
  findUserBySessionId,
  findUserByName,
  createSession,
  deleteSession,
  createUser,
  getNotes,
  createNote
}
