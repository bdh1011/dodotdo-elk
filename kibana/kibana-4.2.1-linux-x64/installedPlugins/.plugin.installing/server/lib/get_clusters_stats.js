const moment = require('moment');
const _ = require('lodash');
const Promise = require('bluebird');
module.exports = (req) => {
  const server = req.server;
  const callWithRequest = server.plugins.elasticsearch.callWithRequest;
  const config = server.config();
  return (clusters) => {
    if (!clusters) return [];
    return Promise.map(clusters, (cluster) => {
      const body = { size: 1, sort: [ { timestamp: 'desc' } ] };
      body.query = {
        filtered: { filter: { term: { cluster_uuid: cluster.cluster_uuid } } }
      };
      const params = {
        index: config.get('marvel.index_prefix') + '*',
        ignore: [404],
        type: 'cluster_stats',
        body: body
      };
      return callWithRequest(req, 'search', params)
        .then((resp) => {
          if (resp.hits.total) {
            cluster.stats = resp.hits.hits[0]._source.cluster_stats;
          }
          return cluster;
        });
    });
  };
};
