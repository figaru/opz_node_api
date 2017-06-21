var NaturalSynaptic = require('./bayes');

var start = process.hrtime();


process.on('message', function(data){

	Ai.jobAI(data.db, data.user).then(() =>{
        process.send({
	      err: null,
	      result: "finished"
	    });
	}).catch(() => {
		process.send({
	      err: "failed",
	      result: null
	    });
	});

});

var elapsed_time = function(note){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    start = process.hrtime(); // reset the timer
}

var jobAI = function(db, userid){
	return new Promise(function(resolve, reject){
		//train log bayes theoreum ANN
		trainBayes(userid, db).then(() => {
			resolve();
		}).catch(() => {
			reject();
		});
	});
};
var trainBayes = function(user, db){
	return new Promise(function(resolve, reject){
		//create the network
		var BayesNetwork = new NaturalSynaptic();

		getExistingNetwok(user, db, (err, network) => {
			if(network){
				console.log("data available");
				BayesNetwork = NaturalSynaptic.fromJSON(network, null);
			}

			//continue
			db.collection('userLogs').find({user: user, validated: true}, {limit: 150}).sort({updateDate: -1}).toArray(function(err, items) {
				if(err){ reject(err); };

				for (var i = items.length - 1; i >= 0; i--) {
					var item = items[i];
					if(item.project){
						BayesNetwork.addDocument(item.title + " " + item.uri, item.project._id);
					}
				}

				elapsed_time("start training bayes...");
				BayesNetwork.train();
				elapsed_time("finish training! user: " + user);

				//export network to json
				var data = BayesNetwork.classifier.toJSON();
			    data.docs = BayesNetwork.docs;
			    data.features = BayesNetwork.features;
			    var jsonNN = JSON.stringify(data);

			    //console.log(res);
				db.collection('userAI').update({
					user: user
				},
				{
					$set: {
						network: jsonNN,
						createDate: new Date(),
					}
				},{upsert: true}, function(err, res){
					if(err){ reject(); }
					else{
						resolve();		
					}
				});
				
			});	
		});
	});	
};

var getExistingNetwok = function(user, db, callback){
	db.collection('userAI').findOne({user: user}, function(err, item){
		if(!item || err){
			//console.log("creating new network");
			//BayesNetwork = new NaturalSynaptic()
			callback(err, null);
		}else{
			console.log("found existing network.");
			//importing json network
		    var nn = JSON.parse(item.network);

			callback(null, nn);
		}
	});
}

module.exports = {
  jobAI: jobAI,
}