const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
   title: { type: String, required: true, minlength: 3, maxlength: 50 },
   body: { type: String, required: true, minlength: 3 },
   user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
   likes: { type: Number, default: 0 },
   dislikes: { type: Number, default: 0 },
   likedBy: [{ type: Schema.Types.ObjectId, ref: 'user' }],
   dislikedBy: [{ type: Schema.Types.ObjectId, ref: 'user' }],
   comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }]
}, { timestamps: true });

// const autoPopulateUsername = function (next) {
//    this.populate('user', 'username');
//    this.populate('likedBy', 'username');
//    this.populate('dislikedBy', 'username');
//    next();
// };

// postSchema
//    .pre('find', autoPopulateUsername)
//    .pre('findOne', autoPopulateUsername)
//    .pre('findById', autoPopulateUsername)

const Post = mongoose.model('post', postSchema);

module.exports = Post;