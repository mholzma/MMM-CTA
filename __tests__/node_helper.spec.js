/* eslint-disable global-require */
beforeAll(() => {
  require('../__mocks__/logger');
  require('../__mocks__/node-fetch');
});

describe('node_helper', () => {
  let helper;
  let fetch;

  beforeEach(() => {
    helper = require('../node_helper');
    Log = require('logger'); // eslint-disable-line import/no-unresolved
    fetch = require('node-fetch'); // eslint-disable-line import/no-unresolved

    helper.setName('MMM-CTA');
  });

  describe('socketNotificationReceived', () => {
    describe('passed proper config', () => {
      it('is true', () => {
        expect(true).toBe(true);
      });
    });

    describe('missing X', () => {
      it('is true', () => {
        expect(true).toBe(true);
      });
    });
  });
});
