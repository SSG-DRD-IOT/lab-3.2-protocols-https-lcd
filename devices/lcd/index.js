var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mylcd = new (require("jsupm_i2clcd").Jhd1313m1)(6, 0x3E, 0x62);

// parse application/json
app.use(bodyParser.json());

app.use(function (req, res, next) {
  console.log(req.body); // populated!
  next();
});

var backlight = {
    r:0,
    g:0,
    b:0
};
mylcd.setColor(backlight.r,backlight.g,backlight.b);

var lcdtext = "";

app.get('/lcd/backlight/', function (req, res) {
  res.status(200).json(backlight);
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

app.delete('/lcd/backlight/', function (req, res) {
  backlight = {r:0,g:0,b:0};
  mylcd.setColor(backlight.r,backlight.g,backlight.b);
  res.status(204).send("Deleted");
});

app.get('/lcd/text/', function (req, res) {
  res.status(200).json(lcdtext);
});

app.post('/lcd/text/', function (req, res) {
  lcdtext = req.query.lcdtext;
  mylcd.clear();
  mylcd.write(lcdtext);
  res.status(201).send("Success");
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
