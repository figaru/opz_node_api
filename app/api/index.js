const noteRoutes = require('./node_routes');
const authRoutes = require('./oauth');
const middleware = require('./middleware');

module.exports = function(server, db) {
  middleware(server, db);

  noteRoutes(server, db);
  // Other route groups could go here, in the future
  authRoutes(server, db);
};

