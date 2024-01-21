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
    const response = await fetch(
      this.trainUrl(stops[0].stopId, maxResultsTrain, trainApiKey),
      this.requestInit(),
    );

    // const { aqi } = (await response.json()).data;

    // this.sendSocketNotification('MMM-CTA-DATA', { aqi });
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

  trainUrl(stopId, maxResults, apiKey) {
    const baseUrl = 'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx';

    return `${baseUrl}?key=${apiKey}&mapid=${stopId}&max=${maxResults}&outputType=json`;
  },
});
