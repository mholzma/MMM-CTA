nunjucks = require('../../__mocks__/nunjucks');

translate = (str) => str;

describe('loading', () => {
  it('shows loading', () => {
    const payload = { loading: true };
    const template = nunjucks.render('MMM-CTA.njk', payload);

    expect(template).toContain('LOADING');
  });
});
