'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _boom = require('boom');

exports['default'] = function (kbnServer, server, config) {
  var token = config.get('server.xsrf.token');
  var disabled = config.get('server.xsrf.disableProtection');

  server.decorate('reply', 'issueXsrfToken', function () {
    return token;
  });

  server.ext('onPostAuth', function (req, reply) {
    if (disabled || req.method === 'get') return reply['continue']();

    var attempt = req.headers['kbn-xsrf-token'];
    if (!attempt) return reply((0, _boom.forbidden)('Missing XSRF token'));
    if (attempt !== token) return reply((0, _boom.forbidden)('Invalid XSRF token'));

    return reply['continue']();
  });
};

module.exports = exports['default'];
