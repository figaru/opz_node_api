const noteRoutes = require('./node_routes');
const authRoutes = require('./oauth');

module.exports = function(app, db) {
  noteRoutes(app, db);
  // Other route groups could go here, in the future
  authRoutes(app, db);
};

