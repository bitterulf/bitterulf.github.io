const fs = require('fs');
require('mithril/test-utils/browserMock')(global)
const m = require('mithril')
const render = require('mithril-node-render')
const pretty = require('pretty');
const reviews = require('../_data/reviews.json')

const List = {
    view: function() {
        return m('div', reviews.map(function(review) {
            return m('div', review.title);
        }));
    }
};

const Page = {
    view: function() {
        return m('html', [
            m('head', [
                m('title', 'list')
            ]),
            m('body', m(List))
        ]);
    }
};

render(m(Page)).then(function (html) {
    fs.writeFileSync('./content/index.html', pretty(html));
});
