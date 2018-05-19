const mongoose = require('mongoose');

const promocodeSchema = new mongoose.Schema({
    name: String,
    discount: Number
});

module.exports = mongoose.model('Promocode', promocodeSchema);