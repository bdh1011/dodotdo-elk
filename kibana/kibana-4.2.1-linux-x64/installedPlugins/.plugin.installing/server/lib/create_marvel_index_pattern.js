var Promise = require('bluebird');
var marvelIndexPattern = require('./marvel_index_pattern.json');
module.exports = function (server) {
  var index = server.config().get('kibana.index');
  var client = server.plugins.elasticsearch.client;
  var config = server.config();
  var marvelIndexPrefix = config.get('marvel.index_prefix');
  var id =  '[' + marvelIndexPrefix + ']YYYY.MM.DD';
  var type = 'index-pattern';
  return client.get({
    index: index,
    type: type,
    id: id,
    ignoreUnavailable: true
  }).catch(function (resp) {
    if (resp.status !== 404) return Promise.reject(resp);
    return client.index({
      index: index,
      type: type,
      id: id,
      body: marvelIndexPattern
    })
    .then(function () {
      return client.search({
        index: index,
        type: 'config',
        body: {
          sort: { 'buildNum': { order: 'desc' } },
          size: 1
        }
      });
    })
    .then(function (resp) {
      var config;
      if (resp.hits.total) {
        config = resp.hits.hits[0];
        if (!config._source.defaultIndex) {
          config._source.defaultIndex = id;
          return client.index({
            index: config._index,
            type: config._type,
            id: config._id,
            body: config._source
          });
        }
      }
    });
  });
};
