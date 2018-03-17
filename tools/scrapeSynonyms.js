const wikipedia = require('node-wikipedia');
const fs = require('fs');
const bluebird = require('bluebird');

const reviews = require('../_data/reviews.json').filter(function(review) {
    return review.type == 'Videospiel';
});

const existingSynonyms = JSON.parse(fs.readFileSync('./_data/synonyms.json'));

const grabWikiContent = bluebird.promisify(function (name, cb) {
    wikipedia.page.data(name, { lang: 'de' }, function(response) {
        cb(null, {name: name, response: response})
    });
});

bluebird.Promise.all(
    reviews.map(function(review) {
        return grabWikiContent(review.title);
    })
).then(function(results) {
    const synonyms = results.map(function(result) {
        return {
            name: result.name,
            synonym: result.response ? result.name : false
        };
    });

    synonyms.forEach(function(entry) {
        if (!existingSynonyms[entry.name]) {
            existingSynonyms[entry.name] = entry.synonym;
        }
    });

    fs.writeFileSync('./_data/synonyms.json', JSON.stringify(existingSynonyms, null, 2));
});
