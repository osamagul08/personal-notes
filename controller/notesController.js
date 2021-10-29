const AppError = require('../utils/appError');
const Notes = require('../model/notesModel');
const catchAsync = require('../utils/catchAsync');
const responseHelper = require('../utils/responseHelper');

exports.getAllNotes = catchAsync(async (req, res, next) => {
    const page = req.query.page*1 || 1;
    const limit = req.query.limit *1 || 100;
    const skip = (page - 1)*limit;
    const totalDoc = await Notes.countDocuments();
    let filter = {};
    if (req.user.role === 'user') {
        filter = {user: req.user.id};
    }
    const allNotes = await Notes.find(filter).skip(skip).limit(limit);
    if (!allNotes) {
        return next(new AppError('zero records'))
    }
    responseHelper(res, 'successful', 200, '', allNotes, totalDoc);
});

exports.createNotes = catchAsync (async (req, res, next) => {
    req.body.user = req.user.id;
    const newNotes = await Notes.create(req.body);
    responseHelper(res, 'successful', 200, 'Note created', newNotes);
});

exports.updateNotes = catchAsync (async (req, res, next) => {
    const updateNotes = await Notes.findByIdAndUpdate(req.params.id,req.body);
    if (!updateNotes) {
        return next(new AppError('User did not Found', 401))
    }
    responseHelper(res, 'successful', 200, 'notes updated', updateNotes)
});

exports.deleteNotes = catchAsync (async (req, res, next) => {
    const deletedUser = await Notes.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
        return next(new AppError('note did not found', 401))
    }
    responseHelper(res, 'successful', 200)
})

exports.getNote = catchAsync (async (req, res, next) => {
    const note = await Notes.findById(req.params.id);
    if (!note) {
        return next(new AppError('User did not found', 401))
    }
    responseHelper(res, 'successful', 200, '', note)
})

exports.markNote = catchAsync (async (req, res, next) => {
    const updateNotes = await Notes.findByIdAndUpdate(req.params.id,{status: true});
    if (!updateNotes) {
        return next(new AppError('Note did not Found', 401))
    }
    responseHelper(res, 'successful', 200, 'Note Mark as Don', updateNotes)
}) 