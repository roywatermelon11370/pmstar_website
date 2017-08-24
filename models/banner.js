var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var MonConn = mongoose.createConnection('mongodb://localhost/PMStar');
var Schema = mongoose.Schema;

var banners = new Schema({
    name: String
});
var banner = MonConn.model('banners', banners);

module.exports = banner;