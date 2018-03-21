var Button = {
    view: function(vnode) {
        return m("button", { style: 'border 1px solid black; border-radius: 8px; background: lightgrey; color: black; border: 1px solid black; margin: 4px;', onclick: vnode.attrs.onclick }, vnode.children);
    }
};

var Title = {
    view: function(vnode) {
        return m("h1", { style: 'color: blue;' }, vnode.children);
    }
};

var Block = {
    view: function(vnode) {
        return m("div", { style: 'padding: 4px;' }, vnode.children);
    }
};

const background = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACnUlEQVR4nO3Sv0oQUBQH4N9LtPgCzk0+QT5Am0sP4NokjQ5BkxC0CNHgIAiBhISZaZx7nVpaHBwCQQiJkExFvEvLfYiGb7pwuX/O+Z0vLVk4SR73ZLmSlUpWW7LWkpcteV3J25Zst2S3Jfs9Oe7JSUu+teR7T057ctaSHz0578lFS3725LInv3ryuyVXLfnTkuuW/G3JTU9ue3LXH+W+LeahljLqSUY9zahnGbWaUc8z6kVGrWfUq4zayKg3GbWZUe8yaiujtjNqJ6PeZ9RuRn3IqL2M+phR+xn1KaMOMupzRh1m1JeMOsqo44z6OtejuX84zx3Me/vznb357u78Z2f+uzXr2Jx1bcw612fdz2cfz2ZfTzJqKaMt5qE/yn1P7npy25Kbmcv1zOmqJ79nfpczz4uenM+cz3py2pLvLfnWk5OeHLdkf85pe87t9ZzjWiWrlaz0ZPkkedyShSQJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA/wHgH7jYsonzQU4JAAAAAElFTkSuQmCC';

Grid = {
    view: function(vnode) {

        return m('table', { border: 1, style: 'border-radius: 8px;'},
            vnode.attrs.data.map(function(rowData, index) {
                var border = '';
                if (vnode.attrs.highlights && vnode.attrs.highlights.indexOf(index) > -1) {
                    var border = 'border: 1px solid red; background-image: url(' + background + ');';
                }

                return m('tr', rowData.map(function(cellData) {
                    return m('td', {style: border + 'border-radius: 8px; padding: 8px; width: 100px;'}, cellData)
                }))
            })
         );
    }
};
