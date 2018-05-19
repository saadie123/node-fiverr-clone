const router = require('express').Router();
const async = require('async');
const Gig = require('../models/gig');
const User = require('../models/user');
const Promocode = require('../models/promocode');

const algoliasearch = require('algoliasearch');
var client = algoliasearch('S61XR194QB', '6d9eb842bb4f6fa9868bb1f48c698e10');
var index = client.initIndex('GigSchema');

router.get('/', (req, res) => {
    Gig.find({},function(err, gigs){
        res.render('main/home',{gigs});
    }).count(8);
});

router.route('/search')
.get((req,res)=>{
    if(req.query.q){
        index.search(req.query.q, (err,content)=>{
            res.render('main/search-results',{content:content.hits, searchResult:req.query.q});
        });
    }
})
.post((req,res)=>{
    res.redirect('/search/?q='+req.body.search);
})


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

router.get('/api/add-promocode', (req, res) => {
    const promocode = new Promocode({
        name: 'testcoupon',
        discount: 0.5
    });
    promocode.save().then(code=>{
        res.json("Successful");
    }).catch(err=>{
        console.log(err);
    });
});

router.post('/promocode', (req, res) => {
    const promocode = req.body.promocode;
    const totalPrice = req.session.price;
    Promocode.findOne({name: promocode}).then(code=>{
        if(code){
            let newPrice = code.discount * totalPrice;
            newPrice = totalPrice - newPrice;
            req.session.price = newPrice;
            res.json(newPrice);
        } else {
            res.json(0);
        }
    }).catch(err=>{
        console.log(err);
    })
});

module.exports = router;
