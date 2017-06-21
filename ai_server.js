var monq = require('monq');
var client = monq('mongodb://opzioAdmin:teamopz@5.158.32.213:27017/meteor?authSource=admin');
const Ai = require('./app/ai');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var queue = client.queue('AI');

var db;

//--------------------------------------------------------
// START AI MAIN
//--------------------------------------------------------
MongoClient.connect("mongodb://opzioAdmin:teamopz@5.158.32.213:27017/meteor?authSource=admin", function(err, database) {
    db = database;

    var worker = client.worker(['AI']);

    worker.register({
        AI: function (params, callback) {
          console.log("getting");
          Ai.jobAI(db, params.user).then(() =>{
            callback(null, "finished");
          }).catch(() => {
            callback("failed", null);
          });
        }
    });

    worker.on('dequeued', function (data) {
      console.log("Starting job [" + data.name + "] for user {" + data.params.user + "}");
    });
    worker.on('failed', function (data) {
      console.log("Job [" + data.name + "] for user {" + data.params.user + "} failed!");
    });
    worker.on('complete', function (data) {
      console.log("Job [" + data.name + "] for user {" + data.params.user + "} finished!");
      db.collection('jobs').remove({_id: data._id});
    });
    worker.on('error', function (err) {
      console.log(data);
    });

    worker.start();

    //createJob("97KztmhkcRXg6CvYW");
});



