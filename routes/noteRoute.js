const express = require('express');
const notesController = require('../controller/notesController');
const authController = require('../controller/authController');
const noteRoute = express.Router();

noteRoute.use(authController.protected);

noteRoute.route('/done/:id').patch(notesController.markNote);

noteRoute.route('/').
get( notesController.getAllNotes)
.post(authController.checkPermission('user'), notesController.createNotes);

noteRoute.route('/:id').
get(notesController.getNote).
patch(notesController.updateNotes).
delete(notesController.deleteNotes);


module.exports = noteRoute;