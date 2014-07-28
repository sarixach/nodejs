var http = require('http');
var fs = require('fs');
var form = require('./form.js');

http.createServer(function(req, res) {
    switch(req.url) {
        case '/':
            readFile('./main.html' , res);
            break;
        case '/contacts':
            readFile('./index.html', res);
            break;
        case '/contacts/get':
            readJsonFile(res);
            break;
        case '/contacts/phone':
            res.end("by phone");
            break;
        case '/contacts/new':
            readFile('./form.html', res);
            break;
        case '/contacts/add':
            var data = '';
            req.addListener('readable', function() {
                data += req.read();
                data += "\r\n|";
            });

            req.addListener('end', function() {
                if (data !== '') {
                    add_contacts(data); //data is json object
                    res.end();
                } else {
                    res.statusCode = 403;
                    res.end("Forbidden :(");
                }
            });
            break;
        default:
            res.statusCode = 404;
            res.end("Page not found");
    }
}).listen(8080);

function add_contacts(data) {
    fs.appendFile('./database.txt', data, function(err) {
        if (!err) {
            console.log("success!");
        }
    });
}

function readFile(file, res) {
    var stream = fs.createReadStream(file, {'encoding' : 'utf8'});
    stream.addListener('readable', function() {
        stream.pipe(res);
    });
}

function readJsonFile(res) {
    var stream = fs.createReadStream('./database.txt', {'encoding' : 'utf8'});
    stream.addListener('readable', function() {
       stream.pipe(res); //output is JSON object with '|'
    });
    stream.addListener('end', function() {
        stream.close();
    });
}