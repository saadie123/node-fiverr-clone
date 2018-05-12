const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const orderSchema = new mongoose.Schema({
    buyer:{type: mongoose.SchemaTypes.ObjectId, ref:'Users'},
    seller:{type: mongoose.SchemaTypes.ObjectId, ref:'Users'},
    gig:{type: mongoose.SchemaTypes.ObjectId, ref:'Gigs'},
    messages: [{
        type: mongoose.SchemaTypes.ObjectId, ref:'Messages'
    }],
    created: { type: Date, default: Date.now }
});

orderSchema.plugin(deepPopulate);

module.exports = mongoose.model('orders',orderSchema);