const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer:{type: mongoose.SchemaTypes.ObjectId, ref:'Users'},
    seller:{type: mongoose.SchemaTypes.ObjectId, ref:'Users'},
    gig:{type: mongoose.SchemaTypes.ObjectId, ref:'Gigs'},
    messages: [{
        message: String,
        creator: {type: mongoose.SchemaTypes.ObjectId, ref:'Users'},
        date: {type: Date}
    }],
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('orders',orderSchema);