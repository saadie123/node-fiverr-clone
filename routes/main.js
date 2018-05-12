const router = require('express').Router();
const async = require('async');
const Gig = require('../models/gig');
const User = require('../models/user');

router.get('/', (req, res) => {
    Gig.find({},function(err, gigs){
        res.render('main/home',{gigs});
    }).count(8);
});

router.get('/my-gigs', (req,res) => {
    Gig.find({owner: req.user.id}, function(err, gigs){
        res.render('main/my-gigs',{gigs});
    });
});

router.get('/add-new-gig', (req, res) => {
    res.render('main/add-new-gig');
});

router.post('/add-new-gig', (req, res) => {
    async.waterfall([
        function(callback){
            const gig = new Gig({
                owner: req.user.id,
                title: req.body.title,
                price: req.body.price,
                category: req.body.category,
                description: req.body.description
            });
            gig.save(function(err, gig){
                callback(err, gig);
            });
        },
        function(gig){
            User.update({_id:req.user.id},{$push:{gigs: gig._id}},function(err, count){
                res.redirect('/my-gigs');
            });
        }
    ])
});

router.get('/service-detail/:id', (req, res) => {
    Gig.findOne({_id: req.params.id}).populate('owner')
    .exec(function(err, gig){
        res.render('main/service-detail',{gig});
    });
});

module.exports = router;
