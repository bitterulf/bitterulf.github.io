var Xray = require('x-ray');
var x = Xray();

x('http://de.ign.com/article/review/', '.main article', [{
    title: 'h2 a',
    type: '.indexBody b',
    image: 'img@src',
    link: 'h2 a@href',
    time: 'time@datetime',
    text: 'p',
    score: '.scoreBox span'
}])
.paginate('li.next a@href')
.limit(1)
.write('./_data/reviews.json');
