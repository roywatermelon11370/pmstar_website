var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var MonConn = mongoose.createConnection('mongodb://localhost/PMStar');
var Schema = mongoose.Schema;

var images = new Schema({
    name: String,
    url: String
});
var img = MonConn.model('images', images);

module.exports = img;