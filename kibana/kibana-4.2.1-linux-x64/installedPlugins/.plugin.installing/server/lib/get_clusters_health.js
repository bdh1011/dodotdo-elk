const _ = require('lodash');
const moment = require('moment');

function isClusterCurrent(cluster) {
  const lastUpdate = moment(cluster.state_timestamp);
  return lastUpdate.isAfter(moment().subtract(10, 'minutes'));
}

module.exports = function (req) {
  const server = req.server;
  const callWithRequest = server.plugins.elasticsearch.callWithRequest;
  const config = server.config();
  return function (clusters) {
    const bodies = [];
    clusters.forEach((cluster) => {
      bodies.push({
        index: config.get('marvel.index_prefix') + '*',
        type: 'cluster_state'
      });
      bodies.push({
        size: 1,
        sort: {
          'timestamp': { order: 'desc' }
        },
        query: {
          filtered: {
            filter: {
              term: {
                'cluster_uuid': cluster.cluster_uuid
              }
            }
          }
        }
      });
    });
    if (!bodies.length) return Promise.resolve();
    const params = {
      index: config.get('marvel.index_prefix') + '*',
      type: 'cluster_state',
      body: bodies
    };
    return callWithRequest(req, 'msearch', params)
      .then((res) => {
        res.responses.forEach((resp) => {
          if (resp.hits.total !== 0) {
            const clusterName = _.get(resp.hits.hits[0], '_source.cluster_uuid');
            const cluster = _.find(clusters, { cluster_uuid: clusterName });
            cluster.status = _.get(resp.hits.hits[0], '_source.cluster_state.status');
            cluster.state_uuid = _.get(resp.hits.hits[0], '_source.cluster_state.state_uuid');
            cluster.state_timestamp = _.get(resp.hits.hits[0], '_source.timestamp');
          }
        });
        return clusters.filter(isClusterCurrent);
      });
  };
};


