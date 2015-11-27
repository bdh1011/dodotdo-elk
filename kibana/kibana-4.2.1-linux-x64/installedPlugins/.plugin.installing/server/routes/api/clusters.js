const _ = require('lodash');
const getClustersStats = require('../../lib/get_clusters_stats');
const getClusters = require('../../lib/get_clusters');
const getClustersHealth = require('../../lib/get_clusters_health');
const getShardStats = require('../../lib/get_shard_stats');
const getNodes = require('../../lib/get_nodes');
const Boom = require('boom');
module.exports = (server) => {

  const config = server.config();
  const callWithRequest = server.plugins.elasticsearch.callWithRequest;

  server.route({
    method: 'GET',
    path: '/marvel/api/v1/clusters',
    handler: (req, reply) => {
      return getClusters(req)
        .then(getClustersStats(req))
        .then(getClustersHealth(req))
        .then(getNodes(req))
        .then(getShardStats(req))
        .then((clusters) => reply(_.sortBy(clusters, 'cluster_uuid')))
        .catch(reply);
    }
  });

  server.route({
    method: 'GET',
    path: '/marvel/api/v1/clusters/{cluster_uuid}/info',
    handler: (req, reply) => {
      const clusterUuid = req.params.cluster_uuid;
      const params = {
        index: config.get('marvel.index_prefix') + 'data',
        type: 'cluster_info',
        id: clusterUuid
      };
      return callWithRequest(req, 'get', params)
        .then((resp) => reply(resp._source))
        .catch((err) => {
          if (err.message === 'Not Found') return reply(Boom.notFound());
          reply(err);
        });
    }
  });

};
