var mongoose = require('mongoose');

var Comment = mongoose.model("Comment", { name: { type: String }, comment: { type: String }, dateInserted: {type: String}});
module.exports = Comment;
