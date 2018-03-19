const lunr = require('elasticlunr');

var index = lunr(function () {
    this.addField('title');
    this.addField('body');
    this.setRef('id');
});

var doc1 = {
    "id": 2,
    "title": "Oracle released its profit report of 2015",
    "body": "As expected, Oracle released its profit report of 2015, during the good sales of database and hardware, Oracle's profit of 2015 reached 12.5 Billion."
}

index.addDoc(doc1);

console.log(index.search("Oracle database profit"));
