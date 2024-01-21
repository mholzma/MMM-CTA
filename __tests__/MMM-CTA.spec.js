/* eslint-disable global-require */
beforeAll(() => {
  require('../__mocks__/Module');
  require('../__mocks__/globalLogger');
});

const name = 'MMM-CTA';

let MMMCTA;

beforeEach(() => {
  jest.resetModules();
  require('../MMM-CTA');

  MMMCTA = global.Module.create(name);
  MMMCTA.setData({ name, identifier: `Module_1_${name}` });
});

it('has a default config', () => {
  expect(MMMCTA.defaults).toEqual({
    updateInterval: 60000,
    trainApiKey: null,
    busApiKey: null,
    maxResultsTrain: 5,
    maxResultsBus: 5,
    stops: [],
  });
});

it('requires expected version', () => {
  expect(MMMCTA.requiresVersion).toBe('2.2.0');
});

it('inits module in loading state', () => {
  expect(MMMCTA.loading).toBe(true);
});

describe('start', () => {
  const originalInterval = setInterval;
  const configObject = {
    trainApiKey: 'TRAIN_API_KEY',
    busApiKey: 'BUS_API_KEY',
    stops: [],
    maxResultsTrain: 5,
    maxResultsBus: 5,
  };

  beforeEach(() => {
    MMMCTA.setConfig(configObject);
    global.setInterval = jest.fn();
  });

  afterEach(() => {
    global.setInterval = originalInterval;
  });

  it('logs start of module', () => {
    MMMCTA.start();

    expect(global.Log.info).toHaveBeenCalledWith('Starting module: MMM-CTA');
  });

  it('requests data from node_helper with config variables', () => {
    MMMCTA.start();

    expect(MMMCTA.sendSocketNotification)
      .toHaveBeenCalledWith('MMM-CTA-FETCH', configObject);
  });

  test('interval requests data from node_helper', () => {
    MMMCTA.start();
    global.setInterval.mock.calls[0][0]();

    expect(MMMCTA.sendSocketNotification).toHaveBeenCalledTimes(2);
    expect(MMMCTA.sendSocketNotification)
      .toHaveBeenCalledWith('MMM-CTA-FETCH', configObject);
  });

  test('interval set starts with default value', () => {
    MMMCTA.setConfig({ updateInterval: 100000 });
    MMMCTA.start();

    expect(global.setInterval)
      .toHaveBeenCalledWith(expect.any(Function), 100000);
  });
});

describe('getTemplate', () => {
  it('returns template path', () => {
    expect(MMMCTA.getTemplate()).toBe('templates/MMM-CTA.njk');
  });
});

describe('getTemplateData', () => {
  it('returns information needed by template', () => {
    expect(MMMCTA.getTemplateData()).toEqual({
      loading: MMMCTA.loading,
    });
  });
});

describe('getStyles', () => {
  it('returns styles path', () => {
    expect(MMMCTA.getStyles()).toEqual([
      'font-awesome.css',
      'MMM-CTA.css',
    ]);
  });
});

describe('socketNotificationReceived', () => {
  const payload = {
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
  };
  describe('notification is MMM-CTA-DATA', () => {
    it('sets stops', () => {
      MMMCTA.socketNotificationReceived('MMM-CTA-DATA', payload);

      expect(MMMCTA.data.stops).toBe(payload.stops);
    });

    it('sets loading to false', () => {
      MMMCTA.socketNotificationReceived('MMM-CTA-DATA', payload);

      expect(MMMCTA.loading).toBe(false);
    });

    it('updates dom', () => {
      MMMCTA.socketNotificationReceived('MMM-CTA-DATA', payload);

      expect(MMMCTA.updateDom).toHaveBeenCalled();
    });
  });

  describe('notification is not MMM-CTA-DATA', () => {
    it('does not set data', () => {
      MMMCTA.socketNotificationReceived('NOT-MMM-CTA-DATA', payload);

      expect(MMMCTA.data.stops).toEqual(undefined);
    });
  });
});
