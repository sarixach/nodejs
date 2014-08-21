var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mydb');

var schema = mongoose.Schema({
	firstName: String,
	lastName: String,
	age: Number,
	email: String,
	sex: String
});

module.exports = mongoose.model('user', schema);