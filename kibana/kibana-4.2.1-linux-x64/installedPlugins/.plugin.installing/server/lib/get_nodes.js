const Promise = require('bluebird');
module.exports = (req) => {
  const server = req.server;
  const callWithRequest = server.plugins.elasticsearch.callWithRequest;
  const config = server.config();
  return (clusters) => {
    return Promise.map(clusters || [], (cluster) => {
      const params = {
        index: config.get('marvel.index_prefix') + '*',
        ignore: [404],
        type: 'cluster_state',
        body: {
          size: 1,
          sort: [{ timestamp: { order: 'desc' } }],
          query: {
            filtered: {
              filter: {
                term: {
                  cluster_uuid: cluster.cluster_uuid
                }
              }
            }
          }
        }
      };
      return callWithRequest(req, 'search', params)
        .then((resp) => {
          if (resp.hits.total) {
            const body = resp.hits.hits[0]._source;
            cluster.nodes = body.cluster_state.nodes;
          }
          return cluster;
        });
    });
  };
};
