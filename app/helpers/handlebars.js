
const hbs = require('hbs');
const { join } = require('path');

module.exports = (app) => {
  const blocks = {};

  hbs.registerHelper('extend', (name, context) => {
    let block = blocks[name];

    if (!block) {
      blocks[name] = [];
      block = blocks[name];
    }

    block.push(context.fn(this));
  });

  hbs.registerHelper('block', (name) => {
    const val = (blocks[name] || []).join('\n');

    blocks[name] = [];

    return val;
  });

  hbs.localsAsTemplateData(app);
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
};
