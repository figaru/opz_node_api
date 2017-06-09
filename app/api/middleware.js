module.exports = function(api, db){
	// ---------------------------------------------------------
	// route middleware to authenticate and check token
	// ---------------------------------------------------------
	api.use(function(req, res, next) {
		//check if route requires auth validation

		console.log(req.url);
		//continue to route
		next();
	});
}