const _ = require('lodash');
const Boom = require('boom');
require.resolve('boom');
module.exports = (server) => {

  const callWithRequest = server.plugins.elasticsearch.callWithRequest;
  const config = server.config();

  server.route({
    path: '/marvel/api/v1/clusters/{cluster_uuid}/state/{state_uuid}/shards',
    method: 'GET',
    handler: (req, reply) => {
      const stateUuid = req.params.state_uuid;
      const clusterUuid = req.params.cluster_uuid;
      const options = {
        index: config.get('marvel.index_prefix') + '*',
        type: 'shards',
        body: {
          size: config.get('marvel.max_bucket_size'),
          query: {
            filtered: {
              filter: {
                bool: {
                  must: [
                    { term: { state_uuid: stateUuid } },
                    { term: { cluster_uuid: clusterUuid } }
                  ]
                }
              }
            }
          }
        }
      };
      if (req.query.node) {
        options.body.query.filtered.filter.bool.must.push({
          term: { 'shard.node': req.query.node }
        });
      } else if (req.query.index) {
        options.body.query.filtered.filter.bool.must.push({
          term: { 'shard.index': req.query.index}
        });
      }
      callWithRequest(req, 'search', options)
        .then((resp) => {
          if (resp.hits.total) {
            reply(resp.hits.hits.map((doc) => doc._source.shard));
          } else {
            reply([]);
          }
        })
        .catch(reply);
    }
  });

};
