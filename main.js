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
////////////////////////////////////////////////////////////////////////////////
// ISTV Block 1
// Load the filesystem, HTTPS and Express libraries and declare an Express variable.
// The Express library provides an easy way to create on HTTPS server, and the 
// body-parser library allows us to declare that the server will use JSON format.
////////////////////////////////////////////////////////////////////////////////
var fs = require('fs');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
// end ISTV block 

////////////////////////////////////////////////////////////////////////////////
// ISTV Block 2
// Load the privateKey and certificate
////////////////////////////////////////////////////////////////////////////////
var privateKey  = fs.readFileSync('./certs/server.key', 'utf8');
var certificate = fs.readFileSync('./certs/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
// end ISTV block 

////////////////////////////////////////////////////////////////////////////////
// ISTV Block 3
// Load the UPM LCD library and create an LCD object
////////////////////////////////////////////////////////////////////////////////
var LCD = require("jsupm_jhd1313m1");
var OFFSET = 512;
var mylcd = new LCD.Jhd1313m1(0 + OFFSET, 0x3E, 0x62);
// end ISTV block 

////////////////////////////////////////////////////////////////////////////////
// ISTV Block 4
// Instantiate the backlight and text variables which holds the value of 
// the text displayed on the LCD and turn the backlight off
////////////////////////////////////////////////////////////////////////////////
var backlight = {r: 0, g: 0, b: 0};
setLCDColor(backlight.r, backlight.g, backlight.b);

var text = "";
// end ISTV block 

////////////////////////////////////////////////////////////////////////////////
// ISTV Block 5
// We'll create two HTTPS GET routines, GET /lcd/backlight and /lcd/text. 
// One to fetch the value of the backlight and the other to get the value of 
// the LCD text.
////////////////////////////////////////////////////////////////////////////////
app.get('/lcd/backlight/', function(req, res) {
  res.status(200).json(backlight);
});

app.get('/lcd/text/', function(req, res) {
  res.status(200).json(text);
});
// end ISTV block 

////////////////////////////////////////////////////////////////////////////////
// ISTV Block 6
// We'll create two HTTPS POST routines, POST /lcd/backlight and /lcd/text. 
// These change the value of the backlight and text.
////////////////////////////////////////////////////////////////////////////////
app.post('/lcd/backlight/', function(req, res) {
  backlight = {
    r: parseInt(req.query.r),
    g: parseInt(req.query.g),
    b: parseInt(req.query.b)
  };
  mylcd.setColor(backlight.r, backlight.g, backlight.b);
  res.status(201).send("Success");
});

app.post('/lcd/text/', function(req, res) {
  mylcd.clear();
  mylcd.write(req.query.text);
  res.status(201).send("Success");
});
// end ISTV block 

////////////////////////////////////////////////////////////////////////////////
// ISTV Block 7
// and lastly two HTTPS DELETE routines, DELETE /lcd/backlight and /lcd/text. 
// Which, of course, clear the text and turn of the backlight.
////////////////////////////////////////////////////////////////////////////////
app.delete('/lcd/backlight/', function(req, res) {
  backlight = {r: 0, g: 0, b: 0};
  mylcd.setColor(backlight.r, backlight.g, backlight.b);
  res.status(204).send("Deleted");
});

app.delete('/lcd/text/', function(req, res) {
  mylcd.clear();
  res.status(204).send("Deleted");
});
// end ISTV block 

////////////////////////////////////////////////////////////////////////////////
// ISTV Block 8
// Now that we've defined all the HTTPS servers Restful APIs we'll instatiate the 
// service and have it listen to a port.
////////////////////////////////////////////////////////////////////////////////
var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8443, function() {
  var host = httpsServer.address().address;
  var port = httpsServer.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
// end ISTV block 

