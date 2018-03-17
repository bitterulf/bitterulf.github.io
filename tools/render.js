const fs = require('fs');
require('mithril/test-utils/browserMock')(global)
const m = require('mithril')
const render = require('mithril-node-render')
const pretty = require('pretty');
const reviews = require('../_data/reviews.json')
const reviewsMeta = require('../_data/reviewsMeta.json')
const synonyms = require('../_data/synonyms.json')

const metaKeys = [];

Object.keys(reviewsMeta).forEach(function(reviewKey){
    Object.keys(reviewsMeta[reviewKey].meta).forEach(function(metaKey) {
        if (metaKeys.indexOf(metaKey) == -1) {
            metaKeys.push(metaKey);
        }
    });
});

console.log(metaKeys);

const List = {
    view: function(vnode) {

        return [
            m('h1', vnode.attrs.type),
            m('div', reviews.filter(function(review) {
                return review.type == vnode.attrs.type && synonyms[review.title] && reviewsMeta[synonyms[review.title]];
            }).map(function(review) {
                const data = reviewsMeta[synonyms[review.title]];

                return [
                    m('h2', review.title),
                    m('div', review.time),
                    m('div', review.score),
                    m('div', review.text),
                    m('div', data.categories.join(', ')),
                    m('div', metaKeys.map(function(metaKey) {
                        return m('div', [ m('span', metaKey+': '), m('span', data.meta[metaKey] || '-') ]);
                    })),
                    m('a', { href: review.link }, m('img', { src: review.image } ))
                ];
            }))
        ];
    }
};

const Page = {
    view: function(vnode) {
        return m('html', [
            m('head', [
                m('title', 'list')
            ]),
            m('body', m(List, vnode.attrs))
        ]);
    }
};

render(m(Page, { type: 'Videospiel' })).then(function (html) {
    fs.writeFileSync('./content/index.html', pretty(html));
});
