const router = require('express').Router();
const Gig = require('../models/gig');

const fee = 3.15;

router.get('/checkout/single-package/:id',(req,res) =>{
    Gig.findOne({_id: req.params.id}, function(err,gig){
        const totalPrice = gig.price + fee;
        req.session.gig = gig;
        req.session.price = totalPrice;
        res.render('checkout/single-package', {gig,totalPrice});
    });
});

module.exports = router;