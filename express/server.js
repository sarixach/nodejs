var express = require('express'),
	path = require('path'),
	fs = require('fs'),
	app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
	res.redirect('/index.html');
});

app.get('/contacts', function(req, res, next) {
	res.redirect('/contacts.html');
});

app.get('/contacts/new', function(req, res, next) {
	res.redirect('/new_contact.html');
});

app.get('/contacts/email/:email', function(req, res, next) {
	var email = req.params.email;

});

app.post('/contacts/add', function(req, res, next) {

	var body = '';
	req.on('data', function(data) {
		body += data;
		body += '\r\n|';
	})

    req.on('end', function() {
        if (body !== '') {
            add_contacts(body); //data is json object
            res.end();
        } else {
            res.statusCode = 403;
            res.end("Forbidden :(");
        }
    });
});


app.get('/contacts/get', function(req, res, next) {
	readJsonFile(res);
});

app.listen(8080);

function readJsonFile(res) {
	var stream = fs.createReadStream('./database.txt', {'encoding' : 'utf8'});
	stream.on('readable', function() {
	   stream.pipe(res); //output is JSON object with '|'
	});
	stream.on('end', function() {
	    stream.close();
	});
}

function add_contacts(data) {
    fs.appendFile('./database.txt', data, function(err) {
        if (!err) {
            console.log("success!");
        }
    });
}