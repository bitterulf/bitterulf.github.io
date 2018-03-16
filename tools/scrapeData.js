var Xray = require('x-ray');
var x = Xray();

x('http://de.ign.com/article/review/', '.main article', [{
    title: 'h2 a',
    type: '.indexBody b',
    link: 'h2 a@href'
}])
.paginate('li.next a@href')
.limit(3)
.write('./_data/reviews.json');
