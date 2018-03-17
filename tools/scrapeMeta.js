const wikipedia = require('node-wikipedia');
const fs = require('fs');
const bluebird = require('bluebird');
const cheerio = require('cheerio');

const reviews = require('../_data/reviews.json').filter(function(review) {
    return review.type == 'Videospiel';
});

const existingSynonyms = JSON.parse(fs.readFileSync('./_data/synonyms.json'));

const grabWikiContent = bluebird.promisify(function (name, cb) {
    wikipedia.page.data(name, { lang: 'de', content: true }, function(response) {
        cb(null, {name: name, response: response})
    });
});

bluebird.Promise.all(
    reviews.map(function(review) {
        return grabWikiContent(existingSynonyms[review.title] || review.title);
    })
).then(function(results) {
    const cleanResults = results.filter(function(entry) {
        return entry.response
    }).map(function(entry) {

         // table.toptextcells
        const $ = cheerio.load(entry.response.text['*']);

        const extractedData = {};

        $('table.toptextcells').each(function(tableIndex, table) {
            $(table).find('tr').each(function(rowIndex, row) {
                extractedData[rowIndex] = {};
                $(row).find('td').each(function(cellIndex, cell) {
                    if (cellIndex == 0) {
                        extractedData[rowIndex].key = $(cell).text().split('\n').join(' ').trim();
                    }
                    else if (cellIndex == 1) {
                        extractedData[rowIndex].value = $(cell).text().split('\n').join(' ').trim();
                    }
                })
            })
        });

        const cleanedExtractedData = {};

        Object.keys(extractedData).forEach(function(rowKey){
            if (extractedData[rowKey].key) {
                cleanedExtractedData[extractedData[rowKey].key] = extractedData[rowKey].value;
            }
        });

        return {
            name: entry.name,
            title: entry.response.title,
            pageid: entry.response.pageid,
            categories: entry.response.categories.map(function(entry) {return entry['*']}),
            meta: cleanedExtractedData
        }
    });

    const metaResult = {};

    cleanResults.forEach(function(entry) {
        metaResult[entry.name] = entry;
    });

    fs.writeFileSync('./_data/reviewsMeta.json', JSON.stringify(metaResult, null, 2));
});
