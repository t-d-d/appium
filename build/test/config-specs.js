require('source-map-support').install();

'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _libConfig = require('../lib/config');

var _libParser = require('../lib/parser');

var _libParser2 = _interopRequireDefault(_libParser);

var _libLogger = require('../lib/logger');

var _libLogger2 = _interopRequireDefault(_libLogger);

var should = _chai2['default'].should();
_chai2['default'].use(_chaiAsPromised2['default']);

describe('Config', function () {
  describe('getGitRev', function () {
    it('should get a reasonable git revision', function callee$2$0() {
      var rev;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap((0, _libConfig.getGitRev)());

          case 2:
            rev = context$3$0.sent;

            rev.should.be.a('string');
            rev.length.should.be.equal(40);
            rev.match(/[0-9a-f]+/i)[0].should.eql(rev);

          case 6:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
  });

  describe('Appium config', function () {
    describe('getAppiumConfig', function () {
      it('should get a configuration object', function callee$3$0() {
        var config;
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap((0, _libConfig.getAppiumConfig)());

            case 2:
              config = context$4$0.sent;

              config.should.be.an('object');
              should.exist(config['git-sha']);
              should.exist(config.built);
              should.exist(config.version);

            case 7:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
    });
    describe('showConfig', function () {
      before(function () {
        _sinon2['default'].spy(console, "log");
      });
      it('should log the config to console', function callee$3$0() {
        var config;
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap((0, _libConfig.getAppiumConfig)());

            case 2:
              config = context$4$0.sent;
              context$4$0.next = 5;
              return _regeneratorRuntime.awrap((0, _libConfig.showConfig)());

            case 5:
              console.log.calledOnce.should.be['true'];
              console.log.getCall(0).args[0].should.contain(JSON.stringify(config));

            case 7:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
    });
  });

  describe('node.js config', function () {
    var _process = process;
    before(function () {
      // need to be able to write to process.version
      // but also to have access to process methods
      // so copy them over to a writable object
      var tempProcess = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(_lodash2['default'].toPairs(process)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          var prop = _step$value[0];
          var value = _step$value[1];

          tempProcess[prop] = value;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      process = tempProcess;
    });
    after(function () {
      process = _process;
    });
    describe('checkNodeOk', function () {
      it('should fail if node is below 0.12', function () {
        process.version = 'v0.9.12';
        _libConfig.checkNodeOk.should['throw']();
        process.version = 'v0.1';
        _libConfig.checkNodeOk.should['throw']();
        process.version = 'v0.10.36';
        _libConfig.checkNodeOk.should['throw']();
      });
      it('should succeed if node is 0.12+', function () {
        process.version = 'v0.12.0';
        _libConfig.checkNodeOk.should.not['throw']();
      });
      it('should succeed if node is 1.x', function () {
        process.version = 'v1.0.0';
        _libConfig.checkNodeOk.should.not['throw']();
      });
    });

    describe('warnNodeDeprecations', function () {
      var spy = undefined;
      before(function () {
        spy = _sinon2['default'].spy(_libLogger2['default'], "warn");
      });
      beforeEach(function () {
        spy.reset();
      });
      it('should log a warning if node is below 0.12', function () {
        process.version = 'v0.9.12';
        (0, _libConfig.warnNodeDeprecations)();
        _libLogger2['default'].warn.callCount.should.equal(1);
      });
      it('should not log a warning if node is 0.12+', function () {
        process.version = 'v0.12.0';
        (0, _libConfig.warnNodeDeprecations)();
        _libLogger2['default'].warn.callCount.should.equal(0);
      });
      it('should not log a warning if node is 1.x', function () {
        process.version = 'v1.0.0';
        (0, _libConfig.warnNodeDeprecations)();
        _libLogger2['default'].warn.callCount.should.equal(0);
      });
    });
  });

  describe('server arguments', function () {
    var parser = (0, _libParser2['default'])();
    parser.debug = true; // throw instead of exit on error; pass as option instead?
    var args = {};
    beforeEach(function () {
      // give all the defaults
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator(parser.rawArgs), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var rawArg = _step2.value;

          args[rawArg[1].dest] = rawArg[1].defaultValue;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    });
    describe('getNonDefaultArgs', function () {
      it('should show none if we have all the defaults', function () {
        var nonDefaultArgs = (0, _libConfig.getNonDefaultArgs)(parser, args);
        _lodash2['default'].keys(nonDefaultArgs).length.should.equal(0);
      });
      it('should catch a non-default argument', function () {
        args.isolateSimDevice = true;
        var nonDefaultArgs = (0, _libConfig.getNonDefaultArgs)(parser, args);
        _lodash2['default'].keys(nonDefaultArgs).length.should.equal(1);
        should.exist(nonDefaultArgs.isolateSimDevice);
      });
    });

    describe('getDeprecatedArgs', function () {
      it('should show none if we have no deprecated arguments', function () {
        var deprecatedArgs = (0, _libConfig.getDeprecatedArgs)(parser, args);
        _lodash2['default'].keys(deprecatedArgs).length.should.equal(0);
      });
      it('should catch a deprecated argument', function () {
        args.showIOSLog = true;
        var deprecatedArgs = (0, _libConfig.getDeprecatedArgs)(parser, args);
        _lodash2['default'].keys(deprecatedArgs).length.should.equal(1);
        should.exist(deprecatedArgs['--show-ios-log']);
      });
      it('should catch a non-boolean deprecated argument', function () {
        args.calendarFormat = 'orwellian';
        var deprecatedArgs = (0, _libConfig.getDeprecatedArgs)(parser, args);
        _lodash2['default'].keys(deprecatedArgs).length.should.equal(1);
        should.exist(deprecatedArgs['--calendar-format']);
      });
    });
  });

  describe('checkValidPort', function () {
    it('should be false for port too high', function () {
      (0, _libConfig.checkValidPort)(65536).should.be['false'];
    });
    it('should be false for port too low', function () {
      (0, _libConfig.checkValidPort)(0).should.be['false'];
    });
    it('should be true for port 1', function () {
      (0, _libConfig.checkValidPort)(1).should.be['true'];
    });
    it('should be true for port 65535', function () {
      (0, _libConfig.checkValidPort)(65535).should.be['true'];
    });
  });

  describe('validateTmpDir', function () {
    it('should fail to use a tmp dir with incorrect permissions', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            (0, _libConfig.validateTmpDir)('/private/if_you_run_with_sudo_this_wont_fail').should.be.rejectedWith(/could not ensure/);

          case 1:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('should fail to use an undefined tmp dir', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            (0, _libConfig.validateTmpDir)().should.be.rejectedWith(/could not ensure/);

          case 1:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('should be able to use a tmp dir with correct permissions', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            (0, _libConfig.validateTmpDir)('/tmp/test_tmp_dir/with/any/number/of/levels').should.not.be.rejected;

          case 1:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
  });

  describe('validateServerArgs', function () {
    var parser = (0, _libParser2['default'])();
    parser.debug = true; // throw instead of exit on error; pass as option instead?
    var defaultArgs = {};
    // give all the defaults
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = _getIterator(parser.rawArgs), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var rawArg = _step3.value;

        defaultArgs[rawArg[1].dest] = rawArg[1].defaultValue;
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
          _iterator3['return']();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    var args = {};
    beforeEach(function () {
      args = _lodash2['default'].clone(defaultArgs);
    });
    describe('mutually exclusive server arguments', function () {
      describe('noReset and fullReset', function () {
        it('should not allow both', function () {
          (function () {
            args.noReset = args.fullReset = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow noReset', function () {
          (function () {
            args.noReset = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should allow fullReset', function () {
          (function () {
            args.fullReset = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
      describe('ipa and safari', function () {
        it('should not allow both', function () {
          (function () {
            args.ipa = args.safari = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow ipa', function () {
          (function () {
            args.ipa = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should allow safari', function () {
          (function () {
            args.safari = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
      describe('app and safari', function () {
        it('should not allow both', function () {
          (function () {
            args.app = args.safari = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow app', function () {
          (function () {
            args.app = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
      describe('forceIphone and forceIpad', function () {
        it('should not allow both', function () {
          (function () {
            args.forceIphone = args.forceIpad = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow forceIphone', function () {
          (function () {
            args.forceIphone = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should allow forceIpad', function () {
          (function () {
            args.forceIpad = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
      describe('deviceName and defaultDevice', function () {
        it('should not allow both', function () {
          (function () {
            args.deviceName = args.defaultDevice = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow deviceName', function () {
          (function () {
            args.deviceName = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should allow defaultDevice', function () {
          (function () {
            args.defaultDevice = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
    });
    describe('validated arguments', function () {
      // checking ports is already done.
      // the only argument left is `backendRetries`
      describe('backendRetries', function () {
        it('should fail with value less than 0', function () {
          args.backendRetries = -1;
          (function () {
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should succeed with value of 0', function () {
          args.backendRetries = 0;
          (function () {
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should succeed with value above 0', function () {
          args.backendRetries = 100;
          (function () {
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,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LGNBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFNO0FBQy9CLFVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxZQUFNO0FBQzdDLGNBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDekIsV0FBQyxZQUFNO0FBQUMsK0NBQW1CLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztXQUFDLENBQUEsQ0FBRSxNQUFNLFNBQU0sRUFBRSxDQUFDO1NBQzVELENBQUMsQ0FBQztBQUNILFVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxZQUFNO0FBQ3pDLGNBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFdBQUMsWUFBTTtBQUFDLCtDQUFtQixNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7V0FBQyxDQUFBLENBQUUsTUFBTSxDQUFDLEdBQUcsU0FBTSxFQUFFLENBQUM7U0FDaEUsQ0FBQyxDQUFDO0FBQ0gsVUFBRSxDQUFDLG1DQUFtQyxFQUFFLFlBQU07QUFDNUMsY0FBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7QUFDMUIsV0FBQyxZQUFNO0FBQUMsK0NBQW1CLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztXQUFDLENBQUEsQ0FBRSxNQUFNLENBQUMsR0FBRyxTQUFNLEVBQUUsQ0FBQztTQUNoRSxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoidGVzdC9jb25maWctc3BlY3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0cmFuc3BpbGU6bW9jaGFcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBjaGFpIGZyb20gJ2NoYWknO1xuaW1wb3J0IHNpbm9uIGZyb20gJ3Npbm9uJztcbmltcG9ydCBjaGFpQXNQcm9taXNlZCBmcm9tICdjaGFpLWFzLXByb21pc2VkJztcbmltcG9ydCB7IGdldEdpdFJldiwgZ2V0QXBwaXVtQ29uZmlnLCBjaGVja05vZGVPaywgd2Fybk5vZGVEZXByZWNhdGlvbnMsXG4gICAgICAgICBnZXROb25EZWZhdWx0QXJncywgZ2V0RGVwcmVjYXRlZEFyZ3MsIHZhbGlkYXRlU2VydmVyQXJncyxcbiAgICAgICAgIHZhbGlkYXRlVG1wRGlyLCBzaG93Q29uZmlnLCBjaGVja1ZhbGlkUG9ydCB9IGZyb20gJy4uL2xpYi9jb25maWcnO1xuaW1wb3J0IGdldFBhcnNlciBmcm9tICcuLi9saWIvcGFyc2VyJztcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi4vbGliL2xvZ2dlcic7XG5cblxubGV0IHNob3VsZCA9IGNoYWkuc2hvdWxkKCk7XG5jaGFpLnVzZShjaGFpQXNQcm9taXNlZCk7XG5cblxuZGVzY3JpYmUoJ0NvbmZpZycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2dldEdpdFJldicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGdldCBhIHJlYXNvbmFibGUgZ2l0IHJldmlzaW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IHJldiA9IGF3YWl0IGdldEdpdFJldigpO1xuICAgICAgcmV2LnNob3VsZC5iZS5hKCdzdHJpbmcnKTtcbiAgICAgIHJldi5sZW5ndGguc2hvdWxkLmJlLmVxdWFsKDQwKTtcbiAgICAgIHJldi5tYXRjaCgvWzAtOWEtZl0rL2kpWzBdLnNob3VsZC5lcWwocmV2KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0FwcGl1bSBjb25maWcnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ2dldEFwcGl1bUNvbmZpZycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZ2V0IGEgY29uZmlndXJhdGlvbiBvYmplY3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGxldCBjb25maWcgPSBhd2FpdCBnZXRBcHBpdW1Db25maWcoKTtcbiAgICAgICAgY29uZmlnLnNob3VsZC5iZS5hbignb2JqZWN0Jyk7XG4gICAgICAgIHNob3VsZC5leGlzdChjb25maWdbJ2dpdC1zaGEnXSk7XG4gICAgICAgIHNob3VsZC5leGlzdChjb25maWcuYnVpbHQpO1xuICAgICAgICBzaG91bGQuZXhpc3QoY29uZmlnLnZlcnNpb24pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ3Nob3dDb25maWcnLCAoKSA9PiB7XG4gICAgICBiZWZvcmUoKCkgPT4ge1xuICAgICAgICBzaW5vbi5zcHkoY29uc29sZSwgXCJsb2dcIik7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgbG9nIHRoZSBjb25maWcgdG8gY29uc29sZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgbGV0IGNvbmZpZyA9IGF3YWl0IGdldEFwcGl1bUNvbmZpZygpO1xuICAgICAgICBhd2FpdCBzaG93Q29uZmlnKCk7XG4gICAgICAgIGNvbnNvbGUubG9nLmNhbGxlZE9uY2Uuc2hvdWxkLmJlLnRydWU7XG4gICAgICAgIGNvbnNvbGUubG9nLmdldENhbGwoMCkuYXJnc1swXS5zaG91bGQuY29udGFpbihKU09OLnN0cmluZ2lmeShjb25maWcpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbm9kZS5qcyBjb25maWcnLCAoKSA9PiB7XG4gICAgbGV0IF9wcm9jZXNzID0gcHJvY2VzcztcbiAgICBiZWZvcmUoKCkgPT4ge1xuICAgICAgLy8gbmVlZCB0byBiZSBhYmxlIHRvIHdyaXRlIHRvIHByb2Nlc3MudmVyc2lvblxuICAgICAgLy8gYnV0IGFsc28gdG8gaGF2ZSBhY2Nlc3MgdG8gcHJvY2VzcyBtZXRob2RzXG4gICAgICAvLyBzbyBjb3B5IHRoZW0gb3ZlciB0byBhIHdyaXRhYmxlIG9iamVjdFxuICAgICAgbGV0IHRlbXBQcm9jZXNzID0ge307XG4gICAgICBmb3IgKGxldCBbcHJvcCwgdmFsdWVdIG9mIF8udG9QYWlycyhwcm9jZXNzKSkge1xuICAgICAgICB0ZW1wUHJvY2Vzc1twcm9wXSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgcHJvY2VzcyA9IHRlbXBQcm9jZXNzO1xuICAgIH0pO1xuICAgIGFmdGVyKCgpID0+IHtcbiAgICAgIHByb2Nlc3MgPSBfcHJvY2VzcztcbiAgICB9KTtcbiAgICBkZXNjcmliZSgnY2hlY2tOb2RlT2snLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGZhaWwgaWYgbm9kZSBpcyBiZWxvdyAwLjEyJywgKCkgPT4ge1xuICAgICAgICBwcm9jZXNzLnZlcnNpb24gPSAndjAuOS4xMic7XG4gICAgICAgIGNoZWNrTm9kZU9rLnNob3VsZC50aHJvdygpO1xuICAgICAgICBwcm9jZXNzLnZlcnNpb24gPSAndjAuMSc7XG4gICAgICAgIGNoZWNrTm9kZU9rLnNob3VsZC50aHJvdygpO1xuICAgICAgICBwcm9jZXNzLnZlcnNpb24gPSAndjAuMTAuMzYnO1xuICAgICAgICBjaGVja05vZGVPay5zaG91bGQudGhyb3coKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBzdWNjZWVkIGlmIG5vZGUgaXMgMC4xMisnLCAoKSA9PiB7XG4gICAgICAgIHByb2Nlc3MudmVyc2lvbiA9ICd2MC4xMi4wJztcbiAgICAgICAgY2hlY2tOb2RlT2suc2hvdWxkLm5vdC50aHJvdygpO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIHN1Y2NlZWQgaWYgbm9kZSBpcyAxLngnLCAoKSA9PiB7XG4gICAgICAgIHByb2Nlc3MudmVyc2lvbiA9ICd2MS4wLjAnO1xuICAgICAgICBjaGVja05vZGVPay5zaG91bGQubm90LnRocm93KCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3YXJuTm9kZURlcHJlY2F0aW9ucycsICgpID0+IHtcbiAgICAgIGxldCBzcHk7XG4gICAgICBiZWZvcmUoKCkgPT4ge1xuICAgICAgICBzcHkgPSBzaW5vbi5zcHkobG9nZ2VyLCBcIndhcm5cIik7XG4gICAgICB9KTtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBzcHkucmVzZXQoKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBsb2cgYSB3YXJuaW5nIGlmIG5vZGUgaXMgYmVsb3cgMC4xMicsICgpID0+IHtcbiAgICAgICAgcHJvY2Vzcy52ZXJzaW9uID0gJ3YwLjkuMTInO1xuICAgICAgICB3YXJuTm9kZURlcHJlY2F0aW9ucygpO1xuICAgICAgICBsb2dnZXIud2Fybi5jYWxsQ291bnQuc2hvdWxkLmVxdWFsKDEpO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIG5vdCBsb2cgYSB3YXJuaW5nIGlmIG5vZGUgaXMgMC4xMisnLCAoKSA9PiB7XG4gICAgICAgIHByb2Nlc3MudmVyc2lvbiA9ICd2MC4xMi4wJztcbiAgICAgICAgd2Fybk5vZGVEZXByZWNhdGlvbnMoKTtcbiAgICAgICAgbG9nZ2VyLndhcm4uY2FsbENvdW50LnNob3VsZC5lcXVhbCgwKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBub3QgbG9nIGEgd2FybmluZyBpZiBub2RlIGlzIDEueCcsICgpID0+IHtcbiAgICAgICAgcHJvY2Vzcy52ZXJzaW9uID0gJ3YxLjAuMCc7XG4gICAgICAgIHdhcm5Ob2RlRGVwcmVjYXRpb25zKCk7XG4gICAgICAgIGxvZ2dlci53YXJuLmNhbGxDb3VudC5zaG91bGQuZXF1YWwoMCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NlcnZlciBhcmd1bWVudHMnLCAoKSA9PiB7XG4gICAgbGV0IHBhcnNlciA9IGdldFBhcnNlcigpO1xuICAgIHBhcnNlci5kZWJ1ZyA9IHRydWU7IC8vIHRocm93IGluc3RlYWQgb2YgZXhpdCBvbiBlcnJvcjsgcGFzcyBhcyBvcHRpb24gaW5zdGVhZD9cbiAgICBsZXQgYXJncyA9IHt9O1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgLy8gZ2l2ZSBhbGwgdGhlIGRlZmF1bHRzXG4gICAgICBmb3IgKGxldCByYXdBcmcgb2YgcGFyc2VyLnJhd0FyZ3MpIHtcbiAgICAgICAgYXJnc1tyYXdBcmdbMV0uZGVzdF0gPSByYXdBcmdbMV0uZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGRlc2NyaWJlKCdnZXROb25EZWZhdWx0QXJncycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgc2hvdyBub25lIGlmIHdlIGhhdmUgYWxsIHRoZSBkZWZhdWx0cycsICgpID0+IHtcbiAgICAgICAgbGV0IG5vbkRlZmF1bHRBcmdzID0gZ2V0Tm9uRGVmYXVsdEFyZ3MocGFyc2VyLCBhcmdzKTtcbiAgICAgICAgXy5rZXlzKG5vbkRlZmF1bHRBcmdzKS5sZW5ndGguc2hvdWxkLmVxdWFsKDApO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIGNhdGNoIGEgbm9uLWRlZmF1bHQgYXJndW1lbnQnLCAoKSA9PiB7XG4gICAgICAgIGFyZ3MuaXNvbGF0ZVNpbURldmljZSA9IHRydWU7XG4gICAgICAgIGxldCBub25EZWZhdWx0QXJncyA9IGdldE5vbkRlZmF1bHRBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgIF8ua2V5cyhub25EZWZhdWx0QXJncykubGVuZ3RoLnNob3VsZC5lcXVhbCgxKTtcbiAgICAgICAgc2hvdWxkLmV4aXN0KG5vbkRlZmF1bHRBcmdzLmlzb2xhdGVTaW1EZXZpY2UpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0RGVwcmVjYXRlZEFyZ3MnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNob3cgbm9uZSBpZiB3ZSBoYXZlIG5vIGRlcHJlY2F0ZWQgYXJndW1lbnRzJywgKCkgPT4ge1xuICAgICAgICBsZXQgZGVwcmVjYXRlZEFyZ3MgPSBnZXREZXByZWNhdGVkQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICBfLmtleXMoZGVwcmVjYXRlZEFyZ3MpLmxlbmd0aC5zaG91bGQuZXF1YWwoMCk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgY2F0Y2ggYSBkZXByZWNhdGVkIGFyZ3VtZW50JywgKCkgPT4ge1xuICAgICAgICBhcmdzLnNob3dJT1NMb2cgPSB0cnVlO1xuICAgICAgICBsZXQgZGVwcmVjYXRlZEFyZ3MgPSBnZXREZXByZWNhdGVkQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICBfLmtleXMoZGVwcmVjYXRlZEFyZ3MpLmxlbmd0aC5zaG91bGQuZXF1YWwoMSk7XG4gICAgICAgIHNob3VsZC5leGlzdChkZXByZWNhdGVkQXJnc1snLS1zaG93LWlvcy1sb2cnXSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgY2F0Y2ggYSBub24tYm9vbGVhbiBkZXByZWNhdGVkIGFyZ3VtZW50JywgKCkgPT4ge1xuICAgICAgICBhcmdzLmNhbGVuZGFyRm9ybWF0ID0gJ29yd2VsbGlhbic7XG4gICAgICAgIGxldCBkZXByZWNhdGVkQXJncyA9IGdldERlcHJlY2F0ZWRBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgIF8ua2V5cyhkZXByZWNhdGVkQXJncykubGVuZ3RoLnNob3VsZC5lcXVhbCgxKTtcbiAgICAgICAgc2hvdWxkLmV4aXN0KGRlcHJlY2F0ZWRBcmdzWyctLWNhbGVuZGFyLWZvcm1hdCddKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnY2hlY2tWYWxpZFBvcnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBmYWxzZSBmb3IgcG9ydCB0b28gaGlnaCcsICgpID0+IHtcbiAgICAgIGNoZWNrVmFsaWRQb3J0KDY1NTM2KS5zaG91bGQuYmUuZmFsc2U7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBiZSBmYWxzZSBmb3IgcG9ydCB0b28gbG93JywgKCkgPT4ge1xuICAgICAgY2hlY2tWYWxpZFBvcnQoMCkuc2hvdWxkLmJlLmZhbHNlO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgYmUgdHJ1ZSBmb3IgcG9ydCAxJywgKCkgPT4ge1xuICAgICAgY2hlY2tWYWxpZFBvcnQoMSkuc2hvdWxkLmJlLnRydWU7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBiZSB0cnVlIGZvciBwb3J0IDY1NTM1JywgKCkgPT4ge1xuICAgICAgY2hlY2tWYWxpZFBvcnQoNjU1MzUpLnNob3VsZC5iZS50cnVlO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndmFsaWRhdGVUbXBEaXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBmYWlsIHRvIHVzZSBhIHRtcCBkaXIgd2l0aCBpbmNvcnJlY3QgcGVybWlzc2lvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICB2YWxpZGF0ZVRtcERpcignL3ByaXZhdGUvaWZfeW91X3J1bl93aXRoX3N1ZG9fdGhpc193b250X2ZhaWwnKS5zaG91bGQuYmUucmVqZWN0ZWRXaXRoKC9jb3VsZCBub3QgZW5zdXJlLyk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBmYWlsIHRvIHVzZSBhbiB1bmRlZmluZWQgdG1wIGRpcicsIGFzeW5jICgpID0+IHtcbiAgICAgIHZhbGlkYXRlVG1wRGlyKCkuc2hvdWxkLmJlLnJlamVjdGVkV2l0aCgvY291bGQgbm90IGVuc3VyZS8pO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgYmUgYWJsZSB0byB1c2UgYSB0bXAgZGlyIHdpdGggY29ycmVjdCBwZXJtaXNzaW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIHZhbGlkYXRlVG1wRGlyKCcvdG1wL3Rlc3RfdG1wX2Rpci93aXRoL2FueS9udW1iZXIvb2YvbGV2ZWxzJykuc2hvdWxkLm5vdC5iZS5yZWplY3RlZDtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3ZhbGlkYXRlU2VydmVyQXJncycsICgpID0+IHtcbiAgICBsZXQgcGFyc2VyID0gZ2V0UGFyc2VyKCk7XG4gICAgcGFyc2VyLmRlYnVnID0gdHJ1ZTsgLy8gdGhyb3cgaW5zdGVhZCBvZiBleGl0IG9uIGVycm9yOyBwYXNzIGFzIG9wdGlvbiBpbnN0ZWFkP1xuICAgIGNvbnN0IGRlZmF1bHRBcmdzID0ge307XG4gICAgLy8gZ2l2ZSBhbGwgdGhlIGRlZmF1bHRzXG4gICAgZm9yIChsZXQgcmF3QXJnIG9mIHBhcnNlci5yYXdBcmdzKSB7XG4gICAgICBkZWZhdWx0QXJnc1tyYXdBcmdbMV0uZGVzdF0gPSByYXdBcmdbMV0uZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBsZXQgYXJncyA9IHt9O1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgYXJncyA9IF8uY2xvbmUoZGVmYXVsdEFyZ3MpO1xuICAgIH0pO1xuICAgIGRlc2NyaWJlKCdtdXR1YWxseSBleGNsdXNpdmUgc2VydmVyIGFyZ3VtZW50cycsICgpID0+IHtcbiAgICAgIGRlc2NyaWJlKCdub1Jlc2V0IGFuZCBmdWxsUmVzZXQnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgbm90IGFsbG93IGJvdGgnLCAoKSA9PiB7XG4gICAgICAgICAgKCgpID0+IHtcbiAgICAgICAgICAgIGFyZ3Mubm9SZXNldCA9IGFyZ3MuZnVsbFJlc2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICAgIH0pLnNob3VsZC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBub1Jlc2V0JywgKCkgPT4ge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLm5vUmVzZXQgPSB0cnVlO1xuICAgICAgICAgICAgdmFsaWRhdGVTZXJ2ZXJBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgICAgfSkuc2hvdWxkLm5vdC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBmdWxsUmVzZXQnLCAoKSA9PiB7XG4gICAgICAgICAgKCgpID0+IHtcbiAgICAgICAgICAgIGFyZ3MuZnVsbFJlc2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICAgIH0pLnNob3VsZC5ub3QudGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRlc2NyaWJlKCdpcGEgYW5kIHNhZmFyaScsICgpID0+IHtcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgYWxsb3cgYm90aCcsICgpID0+IHtcbiAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgYXJncy5pcGEgPSBhcmdzLnNhZmFyaSA9IHRydWU7XG4gICAgICAgICAgICB2YWxpZGF0ZVNlcnZlckFyZ3MocGFyc2VyLCBhcmdzKTtcbiAgICAgICAgICB9KS5zaG91bGQudGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgaXBhJywgKCkgPT4ge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmlwYSA9IHRydWU7XG4gICAgICAgICAgICB2YWxpZGF0ZVNlcnZlckFyZ3MocGFyc2VyLCBhcmdzKTtcbiAgICAgICAgICB9KS5zaG91bGQubm90LnRocm93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IHNhZmFyaScsICgpID0+IHtcbiAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgYXJncy5zYWZhcmkgPSB0cnVlO1xuICAgICAgICAgICAgdmFsaWRhdGVTZXJ2ZXJBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgICAgfSkuc2hvdWxkLm5vdC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZGVzY3JpYmUoJ2FwcCBhbmQgc2FmYXJpJywgKCkgPT4ge1xuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhbGxvdyBib3RoJywgKCkgPT4ge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmFwcCA9IGFyZ3Muc2FmYXJpID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICAgIH0pLnNob3VsZC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBhcHAnLCAoKSA9PiB7XG4gICAgICAgICAgKCgpID0+IHtcbiAgICAgICAgICAgIGFyZ3MuYXBwID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICAgIH0pLnNob3VsZC5ub3QudGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRlc2NyaWJlKCdmb3JjZUlwaG9uZSBhbmQgZm9yY2VJcGFkJywgKCkgPT4ge1xuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhbGxvdyBib3RoJywgKCkgPT4ge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmZvcmNlSXBob25lID0gYXJncy5mb3JjZUlwYWQgPSB0cnVlO1xuICAgICAgICAgICAgdmFsaWRhdGVTZXJ2ZXJBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgICAgfSkuc2hvdWxkLnRocm93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGZvcmNlSXBob25lJywgKCkgPT4ge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmZvcmNlSXBob25lID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICAgIH0pLnNob3VsZC5ub3QudGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgZm9yY2VJcGFkJywgKCkgPT4ge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmZvcmNlSXBhZCA9IHRydWU7XG4gICAgICAgICAgICB2YWxpZGF0ZVNlcnZlckFyZ3MocGFyc2VyLCBhcmdzKTtcbiAgICAgICAgICB9KS5zaG91bGQubm90LnRocm93KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBkZXNjcmliZSgnZGV2aWNlTmFtZSBhbmQgZGVmYXVsdERldmljZScsICgpID0+IHtcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgYWxsb3cgYm90aCcsICgpID0+IHtcbiAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgYXJncy5kZXZpY2VOYW1lID0gYXJncy5kZWZhdWx0RGV2aWNlID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICAgIH0pLnNob3VsZC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBkZXZpY2VOYW1lJywgKCkgPT4ge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmRldmljZU5hbWUgPSB0cnVlO1xuICAgICAgICAgICAgdmFsaWRhdGVTZXJ2ZXJBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgICAgfSkuc2hvdWxkLm5vdC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBkZWZhdWx0RGV2aWNlJywgKCkgPT4ge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmRlZmF1bHREZXZpY2UgPSB0cnVlO1xuICAgICAgICAgICAgdmFsaWRhdGVTZXJ2ZXJBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgICAgfSkuc2hvdWxkLm5vdC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGRlc2NyaWJlKCd2YWxpZGF0ZWQgYXJndW1lbnRzJywgKCkgPT4ge1xuICAgICAgLy8gY2hlY2tpbmcgcG9ydHMgaXMgYWxyZWFkeSBkb25lLlxuICAgICAgLy8gdGhlIG9ubHkgYXJndW1lbnQgbGVmdCBpcyBgYmFja2VuZFJldHJpZXNgXG4gICAgICBkZXNjcmliZSgnYmFja2VuZFJldHJpZXMnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgZmFpbCB3aXRoIHZhbHVlIGxlc3MgdGhhbiAwJywgKCkgPT4ge1xuICAgICAgICAgIGFyZ3MuYmFja2VuZFJldHJpZXMgPSAtMTtcbiAgICAgICAgICAoKCkgPT4ge3ZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO30pLnNob3VsZC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBzdWNjZWVkIHdpdGggdmFsdWUgb2YgMCcsICgpID0+IHtcbiAgICAgICAgICBhcmdzLmJhY2tlbmRSZXRyaWVzID0gMDtcbiAgICAgICAgICAoKCkgPT4ge3ZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO30pLnNob3VsZC5ub3QudGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdzaG91bGQgc3VjY2VlZCB3aXRoIHZhbHVlIGFib3ZlIDAnLCAoKSA9PiB7XG4gICAgICAgICAgYXJncy5iYWNrZW5kUmV0cmllcyA9IDEwMDtcbiAgICAgICAgICAoKCkgPT4ge3ZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO30pLnNob3VsZC5ub3QudGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==