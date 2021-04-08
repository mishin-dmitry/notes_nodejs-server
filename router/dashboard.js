const express = require("express");
const auth = require("../middlewares/auth");
const { checkUserWithSendStatus } = require("../middlewares/checkUser");
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

router.get("/", auth, checkUserWithSendStatus, (req, res) => {
  res.render("dashboard", { username: req.user?.username });
});

router.get("/notes", auth, checkUserWithSendStatus, async (req, res) => {
  const userId = req.user?.id;
  const { age, page, search } = req.query;

  try {
    const notes = await getNotes(userId, { age, page, search });
    res.json({ data: notes });
  } catch (e) {
    res.status(500).send("Error during getting notes");
  }
});

router.post("/notes/new", auth, checkUserWithSendStatus, async (req, res) => {
  const userId = req.user?.id;
  const { title, text } = req.body;

  try {
    const note = await createNote({ userId, title, text });
    return res.json(note);
  } catch (e) {
    res.status(500).send("Error during creating note")
  }
});

router.get("/note/:id", auth, checkUserWithSendStatus, async (req, res) => {
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

router.put("/note/:id/archive", auth, checkUserWithSendStatus, async (req, res) => {
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

router.put("/note/:id/unarchive", auth, checkUserWithSendStatus, async (req, res) => {
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

router.put("/note/:id/edit", auth, checkUserWithSendStatus, async (req, res) => {
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

router.delete("/note/:id/delete", auth, checkUserWithSendStatus, async (req, res) => {
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

router.delete("/notes/delete-archived", auth, checkUserWithSendStatus, async (req, res) => {
  const userId = req.user?.id;

  try {
    await deletingArchivedNotes(userId);
    res.json({});
  } catch (e) {
    res.status(500).send("Error during deleting archived notes");
  }
});

module.exports = router;
