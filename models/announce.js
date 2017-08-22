var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var MonConn = mongoose.createConnection('mongodb://localhost/PMStar');
var Schema = mongoose.Schema;

var announce = new Schema({
    title: String,
    date: Date,
    content: String,
    attachment: String
});
var ann = MonConn.model('announce', announce);

module.exports = ann;