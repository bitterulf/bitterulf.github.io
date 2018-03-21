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

Grid = {
    view: function(vnode) {

        return m('table', { border: 1, style: 'border-radius: 8px;'},
            vnode.attrs.data.map(function(rowData, index) {
                var border = '';
                if (vnode.attrs.highlights && vnode.attrs.highlights.indexOf(index) > -1) {
                    var border = 'border: 1px solid red;';
                }

                return m('tr', rowData.map(function(cellData) {
                    return m('td', {style: border + 'border-radius: 8px; padding: 8px; width: 100px;'}, cellData)
                }))
            })
         );
    }
};
