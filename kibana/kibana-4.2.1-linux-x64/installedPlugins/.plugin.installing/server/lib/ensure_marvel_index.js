var Promise = require('bluebird');
var createMarvelIndexPattern = require('./create_marvel_index_pattern');
module.exports = function (plugin, server) {
  plugin.status.yellow('Waiting for Elasticsearch');
  var client = server.plugins.elasticsearch.client;

  // Once the elasticsearch plugin goes green we need to start setting up
  // the Marvel index.
  server.plugins.elasticsearch.status.on('green', function () {
    return createMarvelIndexPattern(server)
      .then(function () {
        plugin.status.green('Marvel index ready');
      });
  });

};
