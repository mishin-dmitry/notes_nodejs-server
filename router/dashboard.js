const express = require("express");
const auth = require("../middlewares/auth");
const { generatePdf } = require("../utils");
const { checkUserWithIndexRedirect } = require("../middlewares/checkUser");
const {
  getNotes,
  createNote,
  getNote,
  archiveNote,
  unarchiveNote,
  updateNoteByUserId,
  deleteNote,
  deletingArchivedNotes
} = require("../db");

const router = express.Router();

const NOTES_CHUNK_SIZE = 20;

router.get("/", auth, checkUserWithIndexRedirect, (req, res) => {
  res.render("dashboard", { username: req.user?.username });
});

router.get("/notes", auth, checkUserWithIndexRedirect, async (req, res) => {
  const userId = req.user?.id;
  const { age, page, search } = req.query;

  const currentPage = page ?? 1;
  const offset = (currentPage - 1) * NOTES_CHUNK_SIZE;

  try {
    const filterData = {
      age,
      limit: NOTES_CHUNK_SIZE,
      offset,
      page: currentPage,
      search
    };

    const { data, count } = await getNotes(userId, filterData);
    res.json({
      data,
      hasMore: count > currentPage * NOTES_CHUNK_SIZE
    });
  } catch (e) {
    res.status(500).send("Error during getting notes");
  }
});

router.post("/notes/new", auth, checkUserWithIndexRedirect, async (req, res) => {
  const userId = req.user?.id;
  const { title, text } = req.body;

  try {
    const note = await createNote({ userId, title, text });
    return res.json(note);
  } catch (e) {
    res.status(500).send("Error during creating note")
  }
});

router.get("/note/:id", auth, checkUserWithIndexRedirect, async (req, res) => {
  const { id: noteId } = req.params;
  const userId = req.user?.id;

  try {
    const note = await getNote(userId, noteId);

    if (!note) {
      return res.status(404).send("Note not found");
    }

    res.json(note);
  } catch (e) {
    res.status(500).send("Error during getting note");
  }
});

router.put("/note/:id/archive", auth, checkUserWithIndexRedirect, async (req, res) => {
  const { id: noteId } = req.params;
  const userId = req.user?.id;

  try {
    const note = await getNote(userId, noteId);

    if (!note) {
      return res.status(404).send("Note not found");
    }

    if (note.isArchived) {
      return res.status(400).send("Note already archived")
    }

    await archiveNote(userId, noteId);
    res.json({});
  } catch (e) {
    res.status(500).send('Error during archiving note');
  }
});

router.put("/note/:id/unarchive", auth, checkUserWithIndexRedirect, async (req, res) => {
  const { id: noteId } = req.params;
  const userId = req.user?.id;

  try {
    const note = await getNote(userId, noteId);

    if (!note) {
      return res.status(404).send("Note not found");
    }

    if (!note.isArchived) {
      return res.status(400).send("Note already unarchived")
    }

    await unarchiveNote(userId, noteId);
    res.json({});
  } catch (e) {
    res.status(500).send('Error during unarchiving note');
  }
});

router.put("/note/:id/edit", auth, checkUserWithIndexRedirect, async (req, res) => {
  const { id: noteId } = req.params;
  const { title, text } = req.body;
  const userId = req.user?.id;

  try {
    const note = await getNote(userId, noteId);

    if (!note) {
      return res.status(404).send("Note not found");
    }

    await updateNoteByUserId(userId, noteId, { title, text });
    res.json({});
  } catch (e) {
    res.status(500).send("Error during updating note");
  }
});

router.delete("/note/:id/delete", auth, checkUserWithIndexRedirect, async (req, res) => {
  const { id: noteId } = req.params;
  const userId = req.user?.id;

  try {
    const note = await getNote(userId, noteId);

    if (!note) {
      return res.status(404).send("Note not found");
    }

    await deleteNote(userId, noteId);
    res.json({});
  } catch (e) {
    res.status(500).send("Error during deleting note");
  }
});

router.delete("/notes/delete-archived", auth, checkUserWithIndexRedirect, async (req, res) => {
  const userId = req.user?.id;

  try {
    await deletingArchivedNotes(userId);
    res.json({});
  } catch (e) {
    res.status(500).send("Error during deleting archived notes");
  }
});

router.post('/note/:id/pdf', auth, checkUserWithIndexRedirect, async (req, res) => {
  const { id: noteId } = req.params;
  const userId = req.user?.id;

  try {
    const note = await getNote(userId, noteId);
    await generatePdf(note.title, note.html);
  } catch (e) {
    res.status(500).send("Error during uploading note");
  }
});

module.exports = router;
