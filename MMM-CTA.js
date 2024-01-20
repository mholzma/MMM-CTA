/* global Module */

/* Magic Mirror
 * Module: MMM-CTA
 *
 * By Jordan Welch
 * MIT Licensed.
 */

Module.register('MMM-CTA', {
  defaults: {
    updateInterval: 60000,
  },

  requiresVersion: '2.2.0',

  loading: true,

  start() {
    Log.info(`Starting module: ${this.name}`);
    const self = this;

    this.getData();

    setInterval(() => {
      self.getData();
    }, this.config.updateInterval);
  },

  getData() {
    this.sendSocketNotification('MMM-CTA-FETCH', {
      token: this.config.token,
      city: this.config.city,
    });
  },

  getTemplate() {
    return 'templates/MMM-CTA.njk';
  },

  getTemplateData() {
    return {
      loading: this.loading,
    };
  },

  getScripts() {
    return [];
  },

  getStyles() {
    return [
      'font-awesome.css',
      'MMM-CTA.css',
    ];
  },

  getTranslations() {
    return {
      en: 'translations/en.json',
      es: 'translations/es.json',
    };
  },

  socketNotificationReceived(notification, payload) {
    if (notification !== 'MMM-CTA-DATA') {
      return;
    }

    this.data.aqi = payload.aqi;
    this.loading = false;
    this.updateDom(300);
  },
});
