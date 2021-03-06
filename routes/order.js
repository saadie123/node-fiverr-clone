const router = require('express').Router();
const stripe = require('stripe')('sk_test_JfMI20QjvPthFLqKdGJRZyXw');
const Gig = require('../models/gig');
const Order = require('../models/order');
const User = require('../models/user');

const fee = 3.15;

router.get('/checkout/single-package/:id',(req,res) =>{
    Gig.findOne({_id: req.params.id}, function(err,gig){
        const totalPrice = gig.price + fee;
        req.session.gig = gig;
        req.session.price = totalPrice;
        res.render('checkout/single-package', {gig,totalPrice});
    });
});

router.get('/checkout/process-cart',(req, res)=>{
    User.findOne({_id:req.user.id}).populate('cart').then((user)=>{
        let price = 0;
        let cartIsEmpty = true;
        if(user.cart.length > 0){
            user.cart.map((item)=>{
                price += item.price;
            });
            var totalPrice = price + fee;
            cartIsEmpty = false;
        } else {
            cartIsEmpty = true;
        }
        req.session.price = totalPrice;
        req.session.gig = user.cart;
        res.render('order/cart',{foundUser:user,totalPrice, subTotal: price,cartIsEmpty});
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
        const order = new Order({
            buyer: req.user.id,
            seller: gig.owner,
            gig: gig._id
        });
        order.save(function(err){
            req.session.gig = null;
            req.session.price = null;
            res.redirect('/users/'+ req.user.id+'/orders/'+order.id);
        });
        // New charge created on a new customer
    }).catch(function(err) {
        // Deal with an error
    });
});

router.get('/payment/cart',(req, res) =>{
    res.render('checkout/payment');
});

router.post('/payment/cart',(req, res)=>{
    const gigs = req.session.gig;
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
        gigs.map(gig=>{
            const order = new Order({
                buyer: req.user._id,
                seller: gig.owner,
                gig: gig._id
            });
            order.save(function(err){
                req.session.gig = null;
                req.session.price = null;
            });
        });
        User.update({_id:req.user._id},{$set:{cart:[]}}).then(user=>{
            if(user){
                res.redirect('/users/'+req.user._id+'/orders');
            }
        })
        // New charge created on a new customer
    }).catch(function(err) {
        // Deal with an error
    });
});

router.get('/users/:userId/orders/:orderId', (req, res) =>{
    req.session.orderId = req.params.orderId;
    Order.findOne({_id:req.params.orderId}).populate('buyer').populate('seller').populate('gig').deepPopulate('messages.owner')
    .exec(function(err, order){
        res.render('order/order-room',{layout: 'chat-layout',order,messages:order.messages, helpers:{
            if_equals: function(a, b, options) {
                if(a.equals(b)){
                    return options.fn(this);
                } else{
                    return options.inverse(this);
                }
            }
        }});
    })
});

router.get('/users/:id/manage-orders', (req, res) =>{
    Order.find({seller:req.user.id}).populate('buyer').populate('seller').populate('gig')
    .exec(function(err, orders){
        res.render('order/order-seller',{orders});
    })
});

router.get('/users/:id/orders', (req, res) =>{
    Order.find({buyer:req.user.id}).populate('buyer').populate('seller').populate('gig')
    .exec(function(err, orders){
        res.render('order/order-buyer',{orders});
    })
});

router.post('/add-to-cart', (req,res)=>{
    const gigId = req.body.gigId;
    User.update({_id:req.user.id},{$push:{cart:gigId}}).then(response=>{
        res.json("Added to cart");
    })
    
});

router.post('/remove-item',(req,res)=>{
    const gigId = req.body.gigId;
    Gig.findById(gigId).then(gig=>{
        User.update({_id:req.user.id},{$pull:{cart:gigId}}).then(response=>{
            let totalPrice = req.session.price - gig.price
            res.json({totalPrice,price:gig.price});
        })
    });
})

module.exports = router;