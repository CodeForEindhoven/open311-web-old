var express = require('express');
var http = require('http');
var path = require('path');

//load express
var app = express();

// all environments
app.set('port', 80);
app.use(express.static(path.join(__dirname, 'static')));

//setup the server
http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
});
