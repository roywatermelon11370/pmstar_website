var express=require("express");
var mongoose = require('mongoose');
var router=express.Router();
var schema=mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/data');
var db = mongoose.connection;

var notification=new schema({
  'title': String,
  'date': Date,
  'content': String
});
var modelschema=mongoose.model('modelschema',notification);

router.post('/news',function(req,res,next){
    var obj=new modelschema({'title':req.body.title,'date':new Date(),'content':req.body.content});
    obj.save(function(err){
      if (err)
        throw err;
      modelschema.find({}, function(err, jizz){
        console.log(jizz);
      });
      res.redirect('/');
    });
})
router.get('/',function(req,res,next){
  res.render('admin',{news:[""]})
})


module.exports = router;
