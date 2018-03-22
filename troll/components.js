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

const generateTexture = function(width, height, color1, color2) {

    const canvas = document.createElement('canvas');

    const ctx = canvas.getContext('2d');
    ctx.canvas.width  = width;
    ctx.canvas.height = height;
    ctx.fillStyle = "rgba("+color1+",0.1)";
    for (var x = 0; x < Math.floor(width/2); x++) {
        ctx.fillRect(x, 0, Math.floor(width/2), height);
    }
    ctx.fillStyle = "rgba("+color2+",0.1)";
    for (var x = 0; x < Math.floor(width/4); x++) {
        ctx.fillRect(x+Math.floor(width/4), 0, Math.floor(width/4), height);
    }

    return canvas.toDataURL();
}

const Images = {
    tile64grey: generateTexture(128, 64, '128,128,128', '255,255,255'),
    tile64red: generateTexture(128, 64, '128,0,0', '255,0,0')
};

Grid = {
    view: function(vnode) {

        return m('table', { border: 1, style: 'border-radius: 8px;'},
            vnode.attrs.data.map(function(rowData, index) {
                var border = '';

                if (vnode.attrs.highlights && vnode.attrs.highlights.indexOf(index) > -1) {
                    border = 'border: 1px solid red; background-image: url(' + Images.tile64red + ');';
                }
                else {
                    border = 'border: 1px solid black; background-image: url(' + Images.tile64grey + ');';
                }

                return m('tr', rowData.map(function(cellData) {
                    return m('td', {style: border + ' border-radius: 8px; padding: 8px; width: 100px;'}, cellData)
                }))
            })
         );
    }
};
