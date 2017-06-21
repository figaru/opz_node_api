const Ai = require('./../ai');
const config = require('./../../config');

var monq = require('monq');
var client = monq(config.db.url);
var db;

var queue = client.queue('AI');

var childProcess = require('child_process');

function Parent(options, callback) {
  var child = childProcess.fork('./../ai/');
  child.send(options);
  child.on('message', function(data){
    callback(data.err, data.result);
    child.kill();
  });
}

var init = (database) => {
  db = database;
  /*queue.enqueue('AI', { text: 'foobar' }, function (err, job) {
      console.log('enqueued:', job.data);
  });*/

  // var worker = client.worker(['AI']);

  // worker.register({
  //     AI: function (params, callback) {
  //       console.log("getting");

  //       var options = {
  //         db: db,
  //         user: params.user
  //       }

  //       Parent(options, (err, res)  => {
  //         if(err){ console.log(err); }
  //         else{
  //           console.log(data);
  //         }
  //         callback(null, "finished");
  //       });

  //       console.log("finished");
  //       Ai.jobAI(db, params.user).then(() =>{
  //         callback(null, "finished");
  //       }).catch(() => {
  //         callback("failed", null);
  //       });
  //     }
  // });

  // worker.on('dequeued', function (data) {
  //   console.log("Starting job [" + data.name + "] for user {" + data.params.user + "}");
  // });
  // worker.on('failed', function (data) {
  //   console.log("Job [" + data.name + "] for user {" + data.params.user + "} failed!");
  // });
  // worker.on('complete', function (data) {
  //   console.log("Job [" + data.name + "] for user {" + data.params.user + "} finished!");
  //   db.collection('jobs').remove({_id: data._id});
  // });
  // worker.on('error', function (err) {
  //   console.log(data);
  // });

  // worker.start();
}

var createJob = function(userid){
  //JOB OPTIONS
  var JOB_DELAY = new Date();//new Date().setMinutes(new Date().getMinutes() + 1));//60*1;
  var JOB_ATTEMPT = 2;
  db.collection('jobs').remove(
    {'params.user': userid}, 
    function(err, obj){
      queue.enqueue('AI', {user:  userid}, { attempts: {count: JOB_ATTEMPT}, delay: JOB_DELAY }, function (err, job) {
        console.log('Enqueued new AI job:', job.data.params.user);
      });
    }
  );
}


/*Parent(options, function(err, data){
  if(err){}
  else{
    console.log(data);
  }
});*/


module.exports  = {
  init: init,
  createJob: createJob,
}