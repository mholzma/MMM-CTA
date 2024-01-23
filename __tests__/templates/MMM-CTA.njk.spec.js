nunjucks = require('../../__mocks__/nunjucks');

translate = (str) => str;

let data;
let template;

describe('loading', () => {
  beforeEach(() => {
    data = { loading: true };
    template = nunjucks.render('MMM-CTA.njk', data);
  });

  it('shows loading', () => {
    expect(template).toContain('LOADING');
  });
});

describe('train stop', () => {
  beforeEach(() => {
    data = {
      stops: [{
        type: 'train',
        name: 'Train Stop',
        arrivals: [
          {
            direction: 'North',
            arrival: 5,
          },
          {
            direction: 'South',
            arrival: 10,
          },
        ],
      }],
    };
    template = nunjucks.render('MMM-CTA.njk', data);
  });

  it('shows train stop name', () => {
    expect(template).toContain('Train Stop');
  });

  it('shows train stop directions', () => {
    expect(template).toContain('North');
    expect(template).toContain('South');
  });

  it('shows train stop arrivals', () => {
    expect(template).toContain('5');
    expect(template).toContain('10');
  });
});

describe('bus stop', () => {
  beforeEach(() => {
    data = {
      stops: [{
        type: 'bus',
        name: 'Bus Stop',
        arrivals: [
          {
            direction: 'North',
            arrival: 5,
          },
          {
            direction: 'South',
            arrival: 10,
          },
        ],
      }],
    };
    template = nunjucks.render('MMM-CTA.njk', data);
  });

  it('shows bus stop name', () => {
    expect(template).toContain('Bus Stop');
  });

  it('shows bus stop directions', () => {
    expect(template).toContain('North');
    expect(template).toContain('South');
  });

  it('shows bus stop arrivals', () => {
    expect(template).toContain('5');
    expect(template).toContain('10');
  });
});

describe('multiple stops', () => {
  beforeEach(() => {
    data = {
      stops: [
        {
          type: 'bus',
          name: 'Bus Stop',
          arrivals: [],
        },
        {
          type: 'train',
          name: 'Train Stop',
          arrivals: [],
        },
      ],
    };
    template = nunjucks.render('MMM-CTA.njk', data);
  });

  it('shows all stop names', () => {
    expect(template).toContain('Bus Stop');
    expect(template).toContain('Train Stop');
  });
});
