var express = require('express');
var bodyParser = require('body-parser');
var app = express();


var groveSensor = require('jsupm_grove');
var relay = new groveSensor.GroveRelay(5);  //Pin 5

// parse application/json
app.use(bodyParser.json());

app.use(function (req, res, next) {
  console.log(req.body); // populated!
  next();
});

app.get('/relay/power/', function (req, res) {
        if (relay.isOn()){
                res.status(200).send("True");
        }
        else {
                res.status(200).send("False");
        }
});

app.post('/relay/power/', function (req, res) {
  relay.on();
  res.status(201).send("Success");
});

app.delete('/relay/power/', function (req, res) {
  relay.off();
  res.status(204).send("Deleted");
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
