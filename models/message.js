const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    owner: {type: mongoose.SchemaTypes.ObjectId, ref:'Users'},
    content: String,
    create:{type:Date, default: Date.now}
});

module.exports = mongoose.model('Messages',messageSchema);