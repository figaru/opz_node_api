# node-accounts

**accounts** is a simple User Management module for Node.js.

Current version supports logins only with providers(Google, Yahoo, Facebook, etc.).

## Usage

All you need to do is to create an application, and then use appId for managing users.

#### Create a new app
```
var Accounts = require('accounts')(storage, options);
var appId;

Accounts.apps.create({
    name: 'Test app'
  }).then(function(app) {
    appId = app.id;
  });
```

#### Provider login
```
var Accounts = require('accounts')(storage);
var appId = process.env.ACCOUNTS_APP_ID;
var App = Accounts.app(appId);

App.login('social', profile)
  .then(function(user) {
    if (user) {
      console.log(user);
    }
    else {
      console.log('login faild');
    }
  });
```
Where `Profile` is a Passport [User Profile](http://passportjs.org/guide/profile/)
```
var profile = {
  provider: 'facebook',
  id: '123124234235123',
  displayName: 'Dumitru K',
  accessData: {
    accessToken:'dsgsgs', refreshToken:'gerge'
  }
};
```

## API

### (storage, options)

Creates a new Client.

## Client API

### admin

- **sync**() - Syncronize DB tables.
- **drop**(secret) - Drop DB tables. Useful for tests.

### apps

- **create**(data) - Create a new application.
- **getById**(id) - Get an application by id.

### app(appId)

Creates a new Application Client for a given app id.

## Application Client API

### login(type, data, options) - User login.

### users

- **create**(data, options) - Create a new user.
- **getById**(id, options) - Get an user object by id.
- **update**(data, options) - Update user fields.
- **deleteById**(id, options) - Delete an user by id.

### identities

- **create**(data, options) - Create a new identity.
- **getById**(id, options) - Get an user identity by id.
- **findByUserId**(userId, options) - Find user identities by user id.
- **update**(data, options) - Update an identity.
- **deleteById**(id, options) - Delete an user identity by id.
- **deleteByUserId**(userId, options) - Delete user identities by user id.


## Storages

- DynamoDB: [dynamo-accounts](https://github.com/Mitica/dynamo-accounts);
- MongoDB: [mongo-accounts](https://github.com/Mitica/mongo-accounts);
