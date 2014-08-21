var express = require('express'),
	path = require('path'),
	fs = require('fs'),
	ejs = require('ejs'),
	db = require('./db.js'), //mongoose
	bodyParser = require('body-parser');
	app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended : true
// }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', function(req, res, next) {
	res.redirect('/index.html');
});

app.get('/contacts', function(req, res, next) {
	res.redirect('/contacts.html');
});

app.get('/contacts/new', function(req, res, next) {
	res.redirect('/new_contact.html');
});

app.get('/:email', function(req, res, next) {
	var email_s = req.params.email;
	if (email_s.match(/[a-z0-9\-\_\.]{2,30}\@[a-z0-9\-\_]{2,30}\.[a-z0-9]{2,4}/)) {

		var User_model = db; //mongoose.model('user', schema);

		User_model.find({email: email_s}, {_id: false, __v: false}, function(err, data) {
			res.render('email.ejs', {data: data[0]});
		});
	} else {
		res.redirect('/');
	}

	// res.render('email', {email: email});
});

app.post('/contacts/add', function(req, res, next) {

	var body = '';
	req.on('data', function(data) {
		body += data;
	});

    req.on('end', function() {
        if (body !== '') {
        	var store = JSON.parse(body);
        	var User_model = db; //mongoose.model('user', schema);

        	var user = new User_model(store);
        	user.save(function(err, user) {
        		if (!err) {
        			console.log("Success");
        		} else {
        			console.log("Error: " + err);
        		}
        	})
            res.end();
        } else {
            res.statusCode = 403;
            res.end("Forbidden :(");
        }
    });
});


app.get('/contacts/get', function(req, res, next) {
	// readJsonFile(res);
	var Userlist = db.model('user', {});
	Userlist.find({},{_id: false, __v: false}, function(err, data) {
		if (!err) {
			res.send(data);
		} else {
			console.log(err);
		}
	});
});

app.post('/contacts/remove', function(req, res, next) {
	var body = '';
	req.on('data', function(data) {
		body += data;
	});

    req.on('end', function() {
        if (body !== '') {
        	var body_json = JSON.parse(body);

        	var Userlist = db.model('user', {});
        	Userlist.remove({email: body_json.email}, function(err) {
        		if (!err) {
        			res.send('removed');
        		} else {
        			res.send('no');
        		}
        	});
        } else {
            res.statusCode = 403;
            res.end("Forbidden :(");
        }
    });
	var Userlist = db.model('user', {});
	
});

app.listen(8080, function(err) {
	if (!err) {
		console.log("Listening: 8080");
	}
});