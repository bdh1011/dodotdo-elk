'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _this = this;

module.exports = function callee$0$0(kbnServer, server, config) {
  var _require, defaults, Boom, formatUrl, _require2, resolve, readFile, fromRoot, UiExports, UiBundle, UiBundleCollection, UiBundlerEnv, loadingGif, uiExports, bundlerEnv, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, plugin, bundles, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, app, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, gen, bundle, defaultInjectedVars;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _require = require('lodash');
        defaults = _require.defaults;
        Boom = require('boom');
        formatUrl = require('url').format;
        _require2 = require('path');
        resolve = _require2.resolve;
        readFile = require('fs').readFileSync;
        fromRoot = require('../utils/fromRoot');
        UiExports = require('./UiExports');
        UiBundle = require('./UiBundle');
        UiBundleCollection = require('./UiBundleCollection');
        UiBundlerEnv = require('./UiBundlerEnv');
        loadingGif = readFile(fromRoot('src/ui/public/loading.gif'), { encoding: 'base64' });
        uiExports = kbnServer.uiExports = new UiExports(kbnServer);
        bundlerEnv = new UiBundlerEnv(config.get('optimize.bundleDir'));

        bundlerEnv.addContext('env', config.get('env.name'));
        bundlerEnv.addContext('sourceMaps', config.get('optimize.sourceMaps'));
        bundlerEnv.addContext('kbnVersion', config.get('pkg.version'));
        bundlerEnv.addContext('buildNum', config.get('pkg.buildNum'));
        uiExports.addConsumer(bundlerEnv);

        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;
        context$1$0.prev = 23;
        for (_iterator = _getIterator(kbnServer.plugins); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          plugin = _step.value;

          uiExports.consumePlugin(plugin);
        }

        context$1$0.next = 31;
        break;

      case 27:
        context$1$0.prev = 27;
        context$1$0.t0 = context$1$0['catch'](23);
        _didIteratorError = true;
        _iteratorError = context$1$0.t0;

      case 31:
        context$1$0.prev = 31;
        context$1$0.prev = 32;

        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }

      case 34:
        context$1$0.prev = 34;

        if (!_didIteratorError) {
          context$1$0.next = 37;
          break;
        }

        throw _iteratorError;

      case 37:
        return context$1$0.finish(34);

      case 38:
        return context$1$0.finish(31);

      case 39:
        bundles = kbnServer.bundles = new UiBundleCollection(bundlerEnv, config.get('optimize.bundleFilter'));
        _iteratorNormalCompletion2 = true;
        _didIteratorError2 = false;
        _iteratorError2 = undefined;
        context$1$0.prev = 43;

        for (_iterator2 = _getIterator(uiExports.getAllApps()); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          app = _step2.value;

          bundles.addApp(app);
        }

        context$1$0.next = 51;
        break;

      case 47:
        context$1$0.prev = 47;
        context$1$0.t1 = context$1$0['catch'](43);
        _didIteratorError2 = true;
        _iteratorError2 = context$1$0.t1;

      case 51:
        context$1$0.prev = 51;
        context$1$0.prev = 52;

        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }

      case 54:
        context$1$0.prev = 54;

        if (!_didIteratorError2) {
          context$1$0.next = 57;
          break;
        }

        throw _iteratorError2;

      case 57:
        return context$1$0.finish(54);

      case 58:
        return context$1$0.finish(51);

      case 59:
        _iteratorNormalCompletion3 = true;
        _didIteratorError3 = false;
        _iteratorError3 = undefined;
        context$1$0.prev = 62;
        _iterator3 = _getIterator(uiExports.getBundleProviders());

      case 64:
        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
          context$1$0.next = 73;
          break;
        }

        gen = _step3.value;
        context$1$0.next = 68;
        return _regeneratorRuntime.awrap(gen(UiBundle, bundlerEnv, uiExports.getAllApps()));

      case 68:
        bundle = context$1$0.sent;

        if (bundle) bundles.add(bundle);

      case 70:
        _iteratorNormalCompletion3 = true;
        context$1$0.next = 64;
        break;

      case 73:
        context$1$0.next = 79;
        break;

      case 75:
        context$1$0.prev = 75;
        context$1$0.t2 = context$1$0['catch'](62);
        _didIteratorError3 = true;
        _iteratorError3 = context$1$0.t2;

      case 79:
        context$1$0.prev = 79;
        context$1$0.prev = 80;

        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
          _iterator3['return']();
        }

      case 82:
        context$1$0.prev = 82;

        if (!_didIteratorError3) {
          context$1$0.next = 85;
          break;
        }

        throw _iteratorError3;

      case 85:
        return context$1$0.finish(82);

      case 86:
        return context$1$0.finish(79);

      case 87:

        // render all views from the ui/views directory
        server.setupViews(resolve(__dirname, 'views'));
        server.exposeStaticFile('/loading.gif', resolve(__dirname, 'public/loading.gif'));

        server.route({
          path: '/app/{id}',
          method: 'GET',
          handler: function handler(req, reply) {
            var id = req.params.id;
            var app = uiExports.apps.byId[id];
            if (!app) return reply(Boom.notFound('Unknown app ' + id));

            if (kbnServer.status.isGreen()) {
              return reply.renderApp(app);
            } else {
              return reply.renderStatusPage();
            }
          }
        });

        defaultInjectedVars = {};

        if (config.has('kibana')) defaultInjectedVars.kbnIndex = config.get('kibana.index');
        if (config.has('elasticsearch')) {
          defaultInjectedVars.esShardTimeout = config.get('elasticsearch.shardTimeout');
          defaultInjectedVars.esApiVersion = config.get('elasticsearch.apiVersion');
        }

        server.decorate('reply', 'renderApp', function (app) {
          var payload = {
            app: app,
            nav: uiExports.apps,
            version: kbnServer.version,
            buildNum: config.get('pkg.buildNum'),
            buildSha: config.get('pkg.buildSha'),
            vars: defaults(app.getInjectedVars(), defaultInjectedVars),
            xsrfToken: this.issueXsrfToken()
          };

          return this.view(app.templateName, {
            app: app,
            loadingGif: loadingGif,
            kibanaPayload: payload
          });
        });

      case 94:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[23, 27, 31, 39], [32,, 34, 38], [43, 47, 51, 59], [52,, 54, 58], [62, 75, 79, 87], [80,, 82, 86]]);
};
