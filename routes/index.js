var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Express' });
});

router.get('/events/:whichone',function(req,res,next){
    var filePath = path.resolve('./views/'+req.params.whichone+'.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(filePath).pipe(res);
})

//router.get('/events/alumni',function(req,res,next){
//    res.render('alumni');
//});

//router.get('/events/mockstocks',function(req,res,next){
//    res.render('mockstocks');
//});
//
//router.get('/events/fincricket',function(req,res,next){
//    res.render('cricket');
//});
//
//router.get('/events/guess',function(req,res,next){
//    res.render('guess');
//});
//
//router.get('/events/absurd',function(req,res,next){
//    res.render('absurd');
//});
//
//router.get('/events/symposium',function(req,res,next){
//    res.render('symposium');
//});
//
//router.get('/events/informal',function(req,res,next){
//    res.render('index');
//});
//
//
router.get('/contest',function(req,res,next){
    res.render('contest');
});

router.get('/about',function(req,res,next){
    res.render('about.ejs');
});

router.post('/new1/submit',function(req,res,next){
    var data = number;
    console.log(data);
    res.json(data);
});
module.exports = router;