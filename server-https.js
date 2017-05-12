var express = require('express'),
    https = require('https'),
    fs = require('fs'),
    bodyParser = require('body-parser');

var PORT = process.env.PORT || 8443;
var HOST = process.env.HOST || '';

var app = express();
//
// app.get('/', function(req, res) {
//     res.end('Welcome on the HTTPS LCD Server !');
// });

var options = {
    key  : fs.readFileSync('certs/server.key'),
    ca   : fs.readFileSync('certs/server.csr'),
    cert : fs.readFileSync('certs/server.crt')
}

// This function will print the route for each incoming HTTP request
app.use(function (req, res, next) {
  console.log(req.method, req.url, req.headers.host); // populated!
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
//mylcd.setColor(backlight.r,backlight.g,backlight.b);

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

////////////////////////////////////////////////////
// POST /lcd/backlight and /lcd/text
// returns the value of the backlight or lcdtext
////////////////////////////////////////////////////
app.post('/lcd/backlight/', function (req, res) {
   backlight = {
      r:parseInt(req.query.r),
      g:parseInt(req.query.g),
      b:parseInt(req.query.b)
  };
  //mylcd.setColor(backlight.r,backlight.g,backlight.b);
  res.status(201).send("Success");
});

app.post('/lcd/text/', function (req, res) {
  lcdtext = req.query.lcdtext;
  //mylcd.clear();
  //mylcd.write(lcdtext);
  res.status(201).send("Success");
});

////////////////////////////////////////////////////
// DELETE /lcd/backlight and /lcd/text
// returns the value of the backlight or lcdtext
////////////////////////////////////////////////////
app.delete('/lcd/backlight/', function (req, res) {
  backlight = {r:0,g:0,b:0};
  //mylcd.setColor(backlight.r,backlight.g,backlight.b);
  res.status(204).send("Deleted");
});

app.delete('/lcd/text/', function (req, res) {
  //mylcd.clear();
  res.status(204).send("Deleted");
});

https.createServer(options, app).listen(PORT, HOST, null, function() {
    console.log('Server listening on port %d in %s mode', this.address().port, app.settings.env);
});
