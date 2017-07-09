var http = require('http'),
    httpProxy = require('http-proxy');
//
// A simple round-robin load balancing strategy.
//
// First, list the servers you want to use in your rotation.
//
var addresses = [
  {
    host: '127.0.0.1',
    port: 8010
  },
  {
    host: '127.0.0.1',
    port: 8011
  }
];
var proxy = httpProxy.createServer();

http.createServer(function (req, res) {
    //
    // On each request, get the first location from the list...
    //
    var target = { target: addresses.shift() };

    //
    // ...then proxy to the server whose 'turn' it is...
    //
    console.log('balancing request to: ', target);
    proxy.web(req, res, target);

    //
    // ...and then the server you just used becomes the last item in the list.
    //
    addresses.push(target.target);
}).listen(3030);