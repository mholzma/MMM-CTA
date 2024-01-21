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
    describe('notification does not match MMM-CTA-FETCH', () => {
      it('does nothing', () => {
        helper.socketNotificationReceived('NOT-CTA-FETCH', {});

        expect(fetch).not.toHaveBeenCalled();
      });
    });

    describe('passed proper train config', () => {
      it('calls train API with passed arguments', () => {
        helper.socketNotificationReceived('MMM-CTA-FETCH', {
          trainApiKey: 'TRAIN_API_KEY',
          busApiKey: null,
          maxResultsTrain: 5,
          maxResultsBus: 5,
          stops: [{
            type: 'train',
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

    describe('passed proper bus config', () => {
      it('calls bus API with passed arguments', () => {
        helper.socketNotificationReceived('MMM-CTA-FETCH', {
          trainApiKey: null,
          busApiKey: 'BUS_API_KEY',
          maxResultsTrain: 5,
          maxResultsBus: 5,
          stops: [{
            type: 'bus',
            stopId: '1234',
            stopName: 'Mock Stop',
          }],
        });

        expect(fetch).toHaveBeenCalledWith(
          'http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=BUS_API_KEY&stpid=1234&top=5&format=json',
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
