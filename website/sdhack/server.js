const express = require('express');
const http = require('http');
const path = require('path');
var createError = require('createerror');
const app = express();

app.use(express.static(path.join(__dirname,'')));

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/', express.static(path.join(__dirname, 'dist')));
app.use('*', express.static(path.join(__dirname, 'dist')));

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
  //next(createError(404));
//});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log('Website running on localhost:8080'));
