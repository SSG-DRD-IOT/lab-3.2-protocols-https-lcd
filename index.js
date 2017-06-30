<<<<<<< HEAD:main.js
/*
 * Author: Daniel Holmlund <daniel.w.holmlund@Intel.com>
 * Copyright (c) 2015 Intel Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Require the filesystem and HTTPS modules
var fs = require('fs');
var https = require('https');

// Load the privateKey and certificate
var privateKey  = fs.readFileSync('./certs/server.key', 'utf8');
var certificate = fs.readFileSync('./certs/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
// The express library provides a quick and easy way to create on HTTP server
var express = require('express');
// Declare the HTTP server as a variable named "app"
var app = express();

// The body-parser library allows us to declare the server will use JSON format
var bodyParser = require('body-parser');

// Instantiate the backlight and lcdtext variables
var backlight = {
  r: 0,
  g: 0,
  b: 0
};

// Holds the value of the text displayed on the LCD
var lcdtext = "";

// noLCD is a boolean to test whether an LCD is present
var noLCD = false

// Load the UPM LCD module
try {
  var LCD = require("jsupm_jhd1313m1");
  var OFFSET = 512;
  var mylcd = new LCD.Jhd1313m1(0 + OFFSET, 0x3E, 0x62);
} catch (e) {
  noLCD = true
}

// parse application/json
app.use(bodyParser.json());

// This function will print the route for each incoming HTTP request
app.use(function(req, res, next) {
  console.log(req.body); // populated!
  next();
});

var setLCDColor = function(r, g, b) {
  console.log("Setting Backlight to (" + r + "," + b + "," + g + ")")
  if (noLCD === false) {
    mylcd.setColor(backlight.r, backlight.g, backlight.b);
  }
}

var setLCDText = function(text) {
  console.log("Set text: ", text)
  if (noLCD === false) {
    mylcd.clear();
    mylcd.write(text);
  }
}

var clearLCDText = function() {
  console.log("Clearing LCD Text")
  if (noLCD === false) {
    mylcd.clear();
  }
}

// When the service starts clearn the backlight
setLCDColor(backlight.r, backlight.g, backlight.b);

////////////////////////////////////////////////////
// GET /lcd/backlight and /lcd/text
// returns the value of the backlight or lcdtext
////////////////////////////////////////////////////
app.get('/lcd/backlight/', function(req, res) {
  res.status(200).json(backlight);
});
app.get('/lcd/text/', function(req, res) {
  res.status(200).json(lcdtext);
});

app.post('/lcd/backlight/', function(req, res) {
  backlight = {
    r: parseInt(req.query.r),
    g: parseInt(req.query.g),
    b: parseInt(req.query.b)
  };
  setLCDColor(backlight.r, backlight.g, backlight.b)
  res.status(201).send("Success");
});

app.post('/lcd/text/', function(req, res) {
  lcdtext = req.query.lcdtext;
  setLCDText(lcdtext)
  res.status(201).send("Success");
});

app.delete('/lcd/backlight/', function(req, res) {
  backlight = {
    r: 0,
    g: 0,
    b: 0
  };
  setLCDColor(backlight.r, backlight.g, backlight.b);
  res.status(204).send("Deleted");
});

app.delete('/lcd/text/', function(req, res) {
  clearLCDText()
  res.status(204).send("Deleted");
});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8443, function() {
  var host = httpsServer.address().address;
  var port = httpsServer.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
=======
var mraa = require("mraa");
mraa.addSubplatform(mraa.GENERIC_FIRMATA, "/dev/ttyACM0");

// The express library provides a quick and easy way to create on HTTP server
var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');

// The body-parser library allows us to declare the server will use JSON format
var bodyParser = require('body-parser');

var privateKey  = fs.readFileSync('/etc/tls-certs/certs/server.key');
var certificate = fs.readFileSync('/etc/tls-certs/certs/server.crt');
var credentials = {key: privateKey, cert: certificate};

// Declare the HTTP server as a variable named "app"
var app = express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// Declare the LCD variable
var LCD = require("jsupm_i2clcd");
var OFFSET = 512;
var mylcd = new LCD.Jhd1313m1(0+OFFSET, 0x3E, 0x62);

// parse application/json
app.use(bodyParser.json());

// This function will print the route for each incoming HTTP request
app.use(function (req, res, next) {
  console.log(req.body); // populated!
  next();
});

var backlight = {
    r:0,
    g:0,
    b:0
};

var lcdtext = "";
mylcd.setColor(backlight.r,backlight.g,backlight.b);

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

var server = httpsServer.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;

console.log('Example app listening at http://%s:%s', host, port);
});
>>>>>>> origin/master:index.js
