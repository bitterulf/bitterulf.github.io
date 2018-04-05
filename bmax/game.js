function changeHue (image, hue) {
    var canvas = fx.canvas();
    var texture = canvas.texture(image);
    canvas.draw(texture).hueSaturation(hue, 0).update();

    return canvas;
}

function getStartStage(game) {
    return {
        init: function(options) {

        },
        preload: function(){
            game.load.image('box', 'assets/box.png');
        },
        create: function() {
            var boxImage = game.cache.getImage('box');

            var bmd = game.make.bitmapData(256, 64);

            bmd.rect(0, 0, 64, 64, 'rgba(255,0,255,0.8)');
            bmd.circle(32, 32, 32, 'rgba(255,0,0,0.8)');

            bmd.rect(64, 0, 64, 64, 'rgba(255,0,255,0.8)');
            bmd.circle(32 + 64, 32, 32, 'rgba(255,128,0,0.8)');

            bmd.rect(128, 0, 64, 64, 'rgba(255,0,255,0.3)');
            bmd.circle(32 + 128, 32, 32, 'rgba(255,0,0,0.8)');

            bmd.rect(128 + 64, 0, 64, 64, 'rgba(255,0,255,0.3)');
            bmd.circle(32 + 128 +64, 32, 32, 'rgba(255,128,0,0.8)');

            bmd.draw(changeHue(boxImage, -1), 0, 0);
            bmd.draw(changeHue(boxImage, -0.5), 64, 0);
            bmd.draw(changeHue(boxImage, 0), 128, 0);
            bmd.draw(changeHue(boxImage, 0.5), 128 + 64, 0);

            game.cache.addSpriteSheet('dynamic', '', bmd.canvas, 64, 64, 4);

            var sprite = game.add.sprite(64, 64, 'dynamic');
            var animation1 = sprite.animations.add('animation1', [0, 1]);
            var animation2 = sprite.animations.add('animation2', [2, 3]);

            animation1.onComplete.add(function() {
                sprite.animations.play('animation2', 2);
            }, this);

            animation2.onComplete.add(function() {
                sprite.animations.play('animation1', 2);
            }, this);

            sprite.animations.play('animation1', 2);

            sprite.anchor.set(0.5);
        },
        update: function() {

        },
        render: function() {

        }
    };
}

function startGame() {
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
    game.state.add('Start', getStartStage(game));
    game.state.start('Start');
}

startGame();

