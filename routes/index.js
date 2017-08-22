var express = require('express');
var router = express.Router();
var announce = require('../models/announce');

router.get('/', function(req, res, next) {
   announce.
      find({}).
      sort({'date': -1}).
      limit(10).
      exec(function(err, anns) {
      res.render('index', {announce: anns, title: "Express"});   
   });
});

module.exports = router;
