var parentHOST = 'localhost';
var parentPORT = 8001;

var net = require('net');
var S = require('string');
var client = new net.Socket();

var interval = setInterval(function() {connectToParent()}, 15000);;

var connectToParent = function () {
  console.log("Connecting to parent...");
  client = new net.Socket();

  client.connect(parentPORT, parentHOST, function() {
    clearInterval(interval);
    console.log('Connected to parent server: ' + parentHOST + ':' + parentPORT);
  });

  client.on('error', function() {
    console.log('Parent connection error');
  });

  client.on('close', function() {
    console.log('parent connection closed');
    clearInterval(interval);
    interval = setInterval(function() {connectToParent()}, 15000);
  });
}


var createAiJob = function(userid){
  client.write(JSON.stringify({user: userid}));
}


module.exports = {
  connect: connectToParent,
  create: createAiJob,
}