const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if(cluster.isMaster){
    // Forking Worker1 and Worker2
    var worker1 = cluster.fork({WorkerName: "api_server"});
    var worker2 = cluster.fork({WorkerName: "ai_server"});

    // Respawn if one of both exits
    cluster.on("exit", function(worker, code, signal){
        if(worker==worker1) worker1 = cluster.fork({WorkerName: "api_server"});        
        if(worker==worker2) worker2 = cluster.fork({WorkerName: "ai_server"});
    });
} else {
    if(process.env.WorkerName=="api_server"){
         // Code of Worker1
         console.log("api_server runnign");
         var exec = require('child_process').exec,
              child;

          child = exec('node main.js',
            function (error, stdout, stderr) {
              console.log('stdout: ' + stdout);
              console.log('stderr: ' + stderr);
              if (error !== null) {
                console.log('exec error: ' + error);
              }
          });
    }

    if(process.env.WorkerName=="ai_server"){
         // Code of Worker2
         console.log("ai_server runnign");
         var exec = require('child_process').exec,
              child;

          child = exec('node ai_worker.js',
            function (error, stdout, stderr) {
              console.log('stdout: ' + stdout);
              console.log('stderr: ' + stderr);
              if (error !== null) {
                console.log('exec error: ' + error);
              }
          });
    }
}