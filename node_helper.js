/* Magic Mirror
 * Node Helper: MMM-Chore-Manager
 *
 * By Jordan Welch
 * MIT Licensed.
 */

const fetch = require('node-fetch');
const Log = require('logger');
const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
  socketNotificationReceived(notification, payload) {
    if (notification !== 'MMM-CTA-FETCH') {
      return;
    }
    if (!this.validate(payload)) {
      return;
    }

    this.getData(payload);
  },

  async getData({
    trainApiKey,
    busApiKey,
    maxResultsTrain,
    maxResultsBus,
    stops,
  }) {
    const responses = stops.map(async (stop) => {
      if (stop.type === 'train') {
        return this.getTrainData(stop.stopId, maxResultsTrain, trainApiKey);
      }

      return this.getBusData(stop.stopId, maxResultsBus, busApiKey);
    });

    // const { aqi } = (await response.json()).data;

    // this.sendSocketNotification('MMM-CTA-DATA', { aqi });
  },

  getBusData(stopId, maxResults, apiKey) {
    return fetch(
      this.busUrl(stopId, maxResults, apiKey),
      this.requestInit(),
    );
  },

  getTrainData(stopId, maxResults, apiKey) {
    return fetch(
      this.trainUrl(stopId, maxResults, apiKey),
      this.requestInit(),
    );
  },

  requestInit() {
    return {
      headers: { Accept: 'application/json' },
    };
  },

  validate(payload) {
    const required = [/** TODO: Add Required */];

    return this.validateRequired(payload, required);
  },

  validateRequired(payload, required) {
    let valid = true;
    required.forEach((req) => {
      if (!payload[req]) {
        Log.error(`MMM-CTA: Missing ${req} in config`);
        valid = false;
      }
    });

    return valid;
  },

  busUrl(stopId, maxResults, apiKey) {
    const baseUrl = 'http://www.ctabustracker.com/bustime/api/v2/getpredictions';

    return `${baseUrl}?key=${apiKey}&stpid=${stopId}&top=${maxResults}&format=json`;
  },

  trainUrl(stopId, maxResults, apiKey) {
    const baseUrl = 'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx';

    return `${baseUrl}?key=${apiKey}&mapid=${stopId}&max=${maxResults}&outputType=json`;
  },
});
