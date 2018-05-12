const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    owner: {type:mongoose.SchemaTypes.ObjectId, ref: 'Users'},
    title: String,
    category: String,
    description: String,
    price: Number,
    picture: {type: String, default: 'http://placehold.it/350x150'},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Gigs', gigSchema);