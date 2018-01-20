const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
   comment: { type: String, required: true, minlength: 3 },
   user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
   likes: { type: Number, default: 0 },
   dislikes: { type: Number, default: 0 },
   likedBy: [{ type: Schema.Types.ObjectId, ref: 'user' }],
   dislikedBy: [{ type: Schema.Types.ObjectId, ref: 'user' }]
}, { timestamps: true });

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;