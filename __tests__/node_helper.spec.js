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
    describe('passed proper train config', () => {
      it('calls train API with passed arguments', () => {
        helper.socketNotificationReceived('MMM-CTA-FETCH', {
          trainApiKey: 'TRAIN_API_KEY',
          busApiKey: null,
          maxResultsTrain: 5,
          maxResultsBus: 5,
          stops: [{
            stopId: '1234',
            stopName: 'Mock Stop',
          }],
        });

        expect(fetch).toHaveBeenCalledWith(
          'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=TRAIN_API_KEY&mapid=1234&max=5&outputType=json',
          { headers: { Accept: 'application/json' } },
        );
      });
    });

    describe('missing X', () => {
      it('is true', () => {
        expect(true).toBe(true);
      });
    });
  });
});
