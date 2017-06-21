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
  user_id: {type: String, optional: false},
  app_id: {type: String, optional: false},
  refresh_token: {type: String, optional: false},
});


var api;
var app;
var db;

//--------------------- AUTH ROUTES ------------------
module.exports = function(Api) {
  app = Api.server;
  db = Api.db;
  api = Api;

  app.get('/oauth/validate', (req, res) => {
    //responde with auth data
    api.response(res, 200, "Access valid");   
  });
  //########################## Authenticate ENDPOINT #####################################
  app.post('/oauth/authorize', (req, res) => {
    //check if params are valid
    isValid = AuthorizeSchema.namedContext("myContext").validate(req.body);
    if(!isValid){api.response(res, 400);}//return error status code
    else{
      // find the user
      db.collection('users').findOne({"emails.address": req.body.email}, (err, user) => {
        if(err){
          api.response(res, 500);
        }else if(!user) {
          api.response(res, 404); //Not Found
        }else{
          api.checkPassword(req.body.pass, user.services.password.bcrypt).then(function(valid){
            if(!valid) api.response(res, 401);
          }).catch();

          //Add a new auth token to the user's account
          var accessToken = api.generateRandomToken();//Api.generateObjToken([user._id, req.body.app_id, new Date()].toString());
          var refreshToken = api.generateRandomToken();//Api.generateObjToken([user._id, new Date()].toString());
          var app_id = req.body.app_id;
          var app_type = req.body.app_type;

          // find the user
          db.collection('userApps').findOne({'user_id': user._id, "app_id": app_id}, (err, appItem) => {
            if(err) api.response(res, 500);

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
                if (err) api.response(res, 500);
                //responde with auth data
                api.response(res, 200, {user_id: user._id, access_token: accessToken, refresh_token: refreshToken});
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
                if(err) api.response(res, 200);
                //responde with auth data
                api.response(res, 200, {user_id: user._id, access_token: accessToken, refresh_token: refreshToken});
              });
            }

          });//end userapp find
        }

      });//end user find
    }

  });//end oauth/authorize route

  //########################## REFRESH ENDPOINT #####################################
  app.post('/oauth/refresh', (req, res) => {
    //check if params are valid
    isValid = RefreshSchema.namedContext("myContext").validate(req.body);
    if(!isValid){
      api.response(res, 400); //bad request
    }else{
      oauth.authorize(req.body).then(function(data){
        if(!data){ api.response(res, 401); }
        else{
          api.response(res, 200, data);
        }
      }).catch(function(err){console.log(err);});
    }

  });//end oauth/refresh route

};


var oauth = {
  authorize: (body) => {
    return new Promise((resolve, reject) => {
      // Retrieve the app from the database
      db.collection('userApps').findOne({
        user_id: body.user_id, 
        app_id: body.app_id, 
        refresh_token: body.refresh_token
      }, (err, appItem) => {
        if(err) { reject(err); }
        else{
          if(!appItem){ resolve(); } //resolve empty -> failed
          else{
            //create new access token refresh token
            var accessToken = api.generateRandomToken();
            var refreshToken = api.generateRandomToken();

            db.collection('userApps').update({'_id': appItem._id}, {
              $set: {
                'access_token': accessToken,
                'refresh_token': refreshToken,
                'access_expire': new Date().getTime() + 1,//valid for 1 day
                'update_date': new Date()
              }
            }, (err, result) => {
              if(err) { reject(err); }
              else{
                //responde with auth data
                resolve({access_token: accessToken, refresh_token: refreshToken});
              }
            });//end update
          }
        } 

      });//end userapps find
    });
  }
}