var express = require('express');
var router = express.Router();
var announce = require('../models/announce');
var jsSHA = require('jssha');

router.post('/news',function(req,res,next){
    var newAnn = new announce({
        title: req.body.title,
        date: new Date(),
        content: req.body.content
    });
    newAnn.save(function(err){
        if(err) throw err;
        res.redirect('/');
    });
});
router.post('/login', function(req, res, next) {
    var hash = new jsSHA("SHA3-256", "TEXT");
    hash.update(String(req.body.pwd)+"ILoveKotori<3");
    if(req.body.pwd && hash.getHash("HEX") === 'be03103692a2499726bcea123167f476668730beaff55fd54021cf22af81e28d'){
        req.session.isLogin = true;
        req.session.loginFailed = 0;
    }else{
        if(!req.session.loginFailed) req.session.loginFailed = 1;
        else req.session.loginFailed += 1;
        req.flash('error', "通關密語錯誤");
    }
    res.redirect("/admin");
});
router.get('/', function(req, res, next) {
    if(req.session.isLogin){
        announce.
            find({}).
            sort({'date': -1}).
            exec(function(err, anns) {
                console.log(anns);
                res.render('admin/panel', {announce: anns});   
            });
    }else{
        res.render('admin/login', { errMsg: req.flash().error });
    }
});

module.exports = router;
