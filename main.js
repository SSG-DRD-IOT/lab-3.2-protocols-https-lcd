// The express library provides a quick and easy way to create on HTTP server
var express = require('express');

// The body-parser library allows us to declare the server will use JSON format
var bodyParser = require('body-parser');

// Declare the HTTP server as a variable named "app"
var app = express();

// Declare the LCD variable
var LCD = require("jsupm_jhd1313m1");
var OFFSET = 512;
var mylcd = new LCD.Jhd1313m1(0+OFFSET, 0x3E, 0x62);

// parse application/json
app.use(bodyParser.json());

// This function will print the route for each incoming HTTP request
app.use(function (req, res, next) {
  console.log(req.body); // populated!
  next();
});

// Instantiate the backlight and lcdtext variables
var backlight = {
    r:0,
    g:0,
    b:0
};

var lcdtext = "";

// When the service starts clearn the backlight
mylcd.setColor(backlight.r,backlight.g,backlight.b);

////////////////////////////////////////////////////
// GET /lcd/backlight and /lcd/text
// returns the value of the backlight or lcdtext
////////////////////////////////////////////////////
app.get('/lcd/backlight/', function (req, res) {
  res.status(200).json(backlight);
});
app.get('/lcd/text/', function (req, res) {
  res.status(200).json(lcdtext);
});

app.post('/lcd/backlight/', function (req, res) {
   backlight = {
      r:parseInt(req.query.r),
      g:parseInt(req.query.g),
      b:parseInt(req.query.b)
  };
  mylcd.setColor(backlight.r,backlight.g,backlight.b);
  res.status(201).send("Success");
});

app.post('/lcd/text/', function (req, res) {
  lcdtext = req.query.lcdtext;
  mylcd.clear();
  mylcd.write(lcdtext);
  res.status(201).send("Success");
});

app.delete('/lcd/backlight/', function (req, res) {
  backlight = {r:0,g:0,b:0};
  mylcd.setColor(backlight.r,backlight.g,backlight.b);
  res.status(204).send("Deleted");
});



app.delete('/lcd/text/', function (req, res) {
  mylcd.clear();
  res.status(204).send("Deleted");
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

console.log('Example app listening at http://%s:%s', host, port);
});
