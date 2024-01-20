mockResponse = require('mockResponse');

jest.mock('node-fetch', () => jest.fn(() => Promise.resolve(mockResponse())));
