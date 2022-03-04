const Notes = require("../models/noteModel");
const Users = require("../models/userModel");
const noteCtrl = {
  getNotes: async (req, res) => {
    try {
      const notes = await Notes.find({ user_id: req.user.id});
      res.json(notes);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createNote: async (req, res) => {
    try {
      const { title, content, date } = req.body;
      const newNote = new Notes({
        title,
        content,
        date,
        user_id: req.user.id,
      });
      await newNote.save();
      res.json({ msg: "Created a Note" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getNote: async (req, res) => {
    try {
      const note = await Notes.findById(req.params.id);
      res.json(note);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateNote: async (req, res) => {
    try {
      const { title, content, date } = req.body;
      await Notes.findOneAndUpdate(
        { _id: req.params.id },
        {
          title,
          content,
          date,
        }
      );
      res.json({ msg: "Updated a Note" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteNote: async (req, res) => {
    try {
      await Notes.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a Note" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
module.exports = noteCtrl;
