require("dotenv").config();

const { client, connection } = require('./knexfile');
const { nanoid } = require("nanoid");
const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true
});
const moment = require("moment");

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


const getNotes = async (userId, { age, limit, offset, search }) => {
  switch (age) {
    case 'archive':
      return _getArchivedNotes(userId, limit, offset);

    case '1month':
      return _getMonthAgoNotes(userId, limit, offset);

    case '3months':
      return _getThreeMonthAgoNotes(userId, limit, offset);

    case 'alltime':
      return _getAllNotes(userId, limit, offset);

    default: return {};
  }
};

const _getNotesForClient = (notes) => {
  return notes.map(note => ({
    title: note.title,
    _id: note.id,
    isArchived: note['is_archived'],
    html: md.render(note.text),
    created: note.created
  }));
}

const _getMonthAgoNotes = async (userId, limit, offset) => {
  const monthAgo = moment().subtract(30, 'days');
  const now = moment();

  const allNotes =  await knex("notes")
    .where({ user_id: userId });

  const filteredNotes = allNotes.filter(note => moment(note.created).isBetween(monthAgo, now));

  const data = filteredNotes.slice(offset, offset + limit);

  return { data: _getNotesForClient(data), count: filteredNotes.length };
};

const _getThreeMonthAgoNotes = async (userId, limit, offset) => {
  const threeMonthAgo = moment().subtract(90, 'days');
  const now = moment();

  const allNotes =  await knex("notes")
    .where({ user_id: userId });

  const filteredNotes = allNotes.filter(note => moment(note.created).isBetween(threeMonthAgo, now));

  const data = filteredNotes.slice(offset, offset + limit);

  return { data: _getNotesForClient(data), count: filteredNotes.length };
};

const _getArchivedNotes = async (userId, limit, offset) => {
  const { count } = await knex("notes")
    .where({ user_id: userId, is_archived: true })
    .count()
    .then(result => result[0]);

  const data = await knex("notes")
    .where({ user_id: userId, is_archived: true })
    .limit(limit)
    .offset(offset);

  return { data: _getNotesForClient(data), count: +count };
};

const _getAllNotes = async (userId, limit, offset) => {
  const { count } = await knex("notes")
    .where({ user_id: userId })
    .count()
    .then(result => result[0]);

  const data = await knex("notes")
    .where({ user_id: userId})
    .limit(limit)
    .offset(offset);

  return { data: _getNotesForClient(data), count: +count };
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
    html: md.render(note.text),
    created: note.created
  };
};

const getNote = async (userId, noteId) => {
  const note = await knex("notes")
    .where({ user_id: userId, id: noteId })
    .limit(1)
    .then(result => result[0]);

  return note && {
    title: note.title,
    _id: note.id,
    isArchived: note['is_archived'],
    text: note.text,
    html: md.render(note.text),
    created: note.created
  };
};

const archiveNote = async (userId, noteId) => {
  await knex("notes")
    .where({ user_id: userId, id: noteId })
    .update({ is_archived: true });
};

const unarchiveNote = async (userId, noteId) => {
  await knex("notes")
    .where({ user_id: userId, id: noteId })
    .update({ is_archived: false });
};

const updateNoteByUserId = async (userId, noteId, { title, text }) => {
  await knex("notes")
    .where({ user_id: userId, id: noteId })
    .update({ title, text });
};

const deleteNote = async (userId, noteId) => {
  await knex("notes")
    .where({ user_id: userId, id: noteId })
    .delete();
};

const deletingArchivedNotes = async (userId) => {
  await knex("notes")
    .where({ user_id: userId, is_archived: true })
    .delete();
};

module.exports = {
  findUserBySessionId,
  findUserByName,
  createSession,
  deleteSession,
  createUser,
  getNotes,
  createNote,
  getNote,
  archiveNote,
  unarchiveNote,
  updateNoteByUserId,
  deleteNote,
  deletingArchivedNotes
}
