const router = require('express').Router();
const stripe = require('stripe')('sk_test_JfMI20QjvPthFLqKdGJRZyXw');
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

router.get('/payment',(req, res) =>{
    res.render('checkout/payment');
});
router.post('/payment',(req, res)=>{
    const gig = req.session.gig;
    let price = req.session.price;
    price *= 100;
    stripe.customers.create({
        email: req.user.email
    }).then(function(customer){
        return stripe.customers.createSource(customer.id, {
            source: req.body.stripeToken
        });
    }).then(function(source) {
        return stripe.charges.create({
            amount: price,
            currency: 'usd',
            customer: source.customer
        });
    }).then(function(charge) {
        res.redirect('/');
        // New charge created on a new customer
    }).catch(function(err) {
        // Deal with an error
    });
});
module.exports = router;