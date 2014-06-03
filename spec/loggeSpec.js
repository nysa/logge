describe('logge', function() {
  var $console, log;

  beforeEach(module('logge'));
  beforeEach(function() {
    var logMethod = function(msg) { log += (msg + ';'); };

    log = '';
    $console = {
      'debug': logMethod,
      'log': logMethod,
      'info': logMethod,
      'warn': logMethod,
      'error': logMethod
    };
  });

  describe('when console is present', function() {
    beforeEach(module(function($provide) {
      $provide.value('$window', {console: $console});
    }));

    it('logs messages', inject(function($logge) {
      $logge.debug('debug');
      $logge.log('log');
      $logge.info('info');
      $logge.warn('warn');
      $logge.error('error');
      expect(log).toEqual('debug;log;info;warn;error;');
    }));
  });

  describe('when console is not present', function() {
    beforeEach(module(function($provide) {
      $provide.value('$window', {});
    }));

    it('calls noop', inject(function($logge) {
      $logge.debug('debug;');
      $logge.log('log');
      $logge.info('info;');
      $logge.warn('warn;');
      $logge.error('error;');
      expect(log).toEqual('');
    }));
  });

  describe('when level is set', function() {
    beforeEach(module(function($provide, $loggeProvider) {
      $provide.value('$window', {console: $console});
      $loggeProvider.level('error');
    }));

    it('calls noop of equal or greater level', inject(function($logge) {
      $logge.info('info');
      $logge.error('error');
      expect(log).toEqual('error;');
    }));
  });
});

