/* eslint-disable global-require */
beforeAll(() => {
  require('../__mocks__/logger');
  require('../__mocks__/node-fetch');
});

const mockBusFetch = (fetch) => fetch.mockReturnValueOnce(Promise.resolve({
  json: () => Promise.resolve({
    'bustime-response': {
      prd: [
        {
          tmstmp: '20240120 20:26',
          typ: 'A',
          stpnm: 'Addison & Lakewood',
          stpid: '12557',
          vid: '1637',
          dstp: 2042,
          rt: '152',
          rtdd: '152',
          rtdir: 'Westbound',
          des: 'Cumberland',
          prdtm: '20240120 20:29',
          tablockid: '152 -403',
          tatripid: '88355271',
          origtatripno: '251994266',
          dly: false,
          prdctdn: '3',
          zone: '',
        },
        {
          tmstmp: '20240120 20:26',
          typ: 'A',
          stpnm: 'Addison & Lakewood',
          stpid: '12557',
          vid: '1408',
          dstp: 10603,
          rt: '152',
          rtdd: '152',
          rtdir: 'Westbound',
          des: 'Cumberland',
          prdtm: '20240120 20:54',
          tablockid: '152 -406',
          tatripid: '88355270',
          origtatripno: '251994148',
          dly: false,
          prdctdn: '27',
          zone: '',
        },
      ],
    },
  }),
}));

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
            id: '1234',
            name: 'Mock Stop',
          }],
        });

        expect(fetch).toHaveBeenCalledWith(
          'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=TRAIN_API_KEY&mapid=1234&max=5&outputType=json',
        );
      });
    });

    describe('passed proper bus config', () => {
      beforeEach(() => {
        mockBusFetch(fetch);

        helper.socketNotificationReceived('MMM-CTA-FETCH', {
          trainApiKey: null,
          busApiKey: 'BUS_API_KEY',
          maxResultsTrain: 5,
          maxResultsBus: 5,
          stops: [{
            type: 'bus',
            id: '1234',
            name: 'Mock Stop',
          }],
        });
      });

      it('calls bus API with passed arguments', () => {
        expect(fetch).toHaveBeenCalledWith(
          'http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=BUS_API_KEY&stpid=1234&top=5&format=json',
        );
      });

      it('sends data to client', () => {
        expect(helper.sendSocketNotification).toHaveBeenCalledWith('MMM-CTA-DATA', {
          stops: [{
            type: 'bus',
            name: 'Mock Stop',
            arrivals: [
              {
                route: '152',
                direction: 'Westbound',
                countdown: '3',
              },
              {
                route: '152',
                direction: 'Westbound',
                countdown: '27',
              },
            ],
          }],
        });
      });
    });

    describe('passed both train and bus configs', () => {
      it('calls bus API with passed arguments', () => {
        mockBusFetch(fetch);

        helper.socketNotificationReceived('MMM-CTA-FETCH', {
          trainApiKey: 'TRAIN_API_KEY',
          busApiKey: 'BUS_API_KEY',
          maxResultsTrain: 5,
          maxResultsBus: 5,
          stops: [
            {
              type: 'train',
              id: '1234',
              name: 'Mock Stop',
            },
            {
              type: 'bus',
              id: '1234',
              name: 'Mock Stop',
            },
          ],
        });

        expect(fetch).toHaveBeenCalledWith(
          'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=TRAIN_API_KEY&mapid=1234&max=5&outputType=json',
        );

        expect(fetch).toHaveBeenCalledWith(
          'http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=BUS_API_KEY&stpid=1234&top=5&format=json',
        );
      });
    });
  });
});
