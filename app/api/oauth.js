//const SimpleSchema  = require("node-simple-schema");
const SimpleSchema  = require("node-simple-schema");

var ObjectID = require('mongodb').ObjectID;

//------------------------------ SCHEMAS ---------------------------------
AuthorizeSchema = new SimpleSchema({
  email: {type: String},
  pass: {type: String},
  app_id: {type: String},
  app_type: {type: String},
});

RefreshSchema = new SimpleSchema({
  user_id: {type: String},
  app_id: {type: String},
  refresh_token: {type: String},
});


//--------------------- AUTH ROUTES ------------------
module.exports = function(Api) {
  var app = Api.server;
  var db = Api.db;

  app.get('/oauth/validate', (req, res) => {
    //responde with auth data
    Api.response(res, 200, "Access valid");   
  });
  //########################## Authenticate ENDPOINT #####################################
  app.post('/oauth/authorize', (req, res) => {
    //check if params are valid
    isValid = AuthorizeSchema.namedContext("myContext").validate(req.body);
    if(!isValid) Api.response(res, 400);//return error status code

    // find the user
    db.collection('users').findOne({"emails.address": req.body.email}, (err, user) => {
      if(err){
        Api.response(res, 500);
      }else if(!user) {
        Api.response(res, 404); //Not Found
      }

      Api.checkPassword(req.body.pass, user.services.password.bcrypt).then(function(valid){
        if(!valid) Api.response(res, 401);
      }).catch();

      //Add a new auth token to the user's account
      var accessToken = Api.generateRandomToken();//Api.generateObjToken([user._id, req.body.app_id, new Date()].toString());
      var refreshToken = Api.generateRandomToken();//Api.generateObjToken([user._id, new Date()].toString());
      var app_id = req.body.app_id;
      var app_type = req.body.app_type;

      // find the user
      db.collection('userApps').findOne({'user_id': user._id, "app_id": app_id}, (err, appItem) => {
        if(err) Api.response(res, 500);

        if(!appItem) {
          const insert = {
            user_id: user._id, 
            app_type: app_type, 
            app_id: app_id,
            refresh_token: refreshToken,
            access_token: accessToken,  
            access_expire: new Date().getTime() + 1,
            update_date: new Date(),
            create_date: new Date()
          };

          db.collection('userApps').insert(insert, (err, results) => {
            if (err) Api.response(res, 500);
            //responde with auth data
            Api.response(res, 200, {user_id: user._id, access_token: accessToken, refresh_token: refreshToken});
          });

        }else{
          db.collection('userApps').update({'_id': appItem._id}, {
            $set: {
              'access_token': accessToken,
              'refresh_token': refreshToken,
              'access_expire': new Date().getTime() + 1,//valid for 1 day
              'update_date': new Date()
            }
          }, (err, result) => {
            if(err) Api.response(res, 200);
            //responde with auth data
            Api.response(res, 200, {user_id: user._id, access_token: accessToken, refresh_token: refreshToken});
          });
        }

      });//end userapp find

    });//end user find

  });//end oauth/authorize route

  //########################## REFRESH ENDPOINT #####################################
  app.post('/oauth/refresh', (req, res) => {
    //check if params are valid
    isValid = RefreshSchema.namedContext("myContext").validate(req.body);
    if(!isValid){
      Api.response(res, 400); //bad request
    }

    // Retrieve the user from the database
    db.collection('users').findOne({_id: req.body.user_id}, (err, user) => {
      if(err){
        Api.response(res, 500);
      }else if(!user) {
        Api.response(res, 404);
      }

      // Retrieve the app from the database
      db.collection('userApps').findOne({user_id: req.body.user_id, app_id: req.body.app_id, refresh_token: req.body.refresh_token}, (err, appItem) => {
        if(err) Api.response(res, 500);

        if(!appItem) {
          Api.response(res, 401);
        }

        //create new access token refresh token
        var accessToken = Api.generateRandomToken();
        var refreshToken = Api.generateRandomToken();

        db.collection('userApps').update({'_id': appItem._id}, {
          $set: {
            'access_token': accessToken,
            'refresh_token': refreshToken,
            'access_expire': new Date().getTime() + 1,//valid for 1 day
            'update_date': new Date()
          }
        }, (err, result) => {
          if(err) Api.response(res, 500);
          //responde with auth data
          Api.response(res, 200, {access_token: accessToken, refresh_token: refreshToken});
        });//end update

      });//end userapps find

    });//end user find

  });//end oauth/refresh route

};
