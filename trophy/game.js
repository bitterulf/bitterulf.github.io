var solvedLevels = [];

function getMainStage(game) {
    var levelData;

    var mouseBody;
    var mouseConstraint;

    var items = [];
    var trophies = [];
    var texts = [];

    var scoreText;
    var button;
    var totalScore = 0;
    var goalScore = 0;

    var goalReached = false;
    var lifting = false;

    var mainStage =  {
        init: function(options){
            game.rnd.sow([options.level])
            levelData = options;

            mouseBody = null;
            mouseConstraint = null;

            items = [];
            trophies = [];
            texts = [];

            scoreText = null;
            button = null;
            totalScore = 0;
            goalScore = 0;

            goalReached = false;
            lifting = false;
        },
        preload: preload,
        create: create,
        update: update,
        render: render
    };

    function preloadTrophies() {
        for (var t = 1; t < 9; t++) {
            game.load.image('trophy'+t+'s', 'assets/sprites/trophy'+t+'s.png');
            game.load.image('trophy'+t+'m', 'assets/sprites/trophy'+t+'m.png');
            game.load.image('trophy'+t, 'assets/sprites/trophy'+t+'.png');
        }
    }

    function preload() {

        game.load.image('shelf', 'assets/sprites/shelf.png');
        game.load.image('background', 'assets/sprites/background.png');
        game.load.image('curtain', 'assets/sprites/curtain.png');
        game.load.spritesheet('button', 'assets/sprites/button.png', 300, 100);

        preloadTrophies();

        game.load.physics('physicsData', 'assets/physics/trophySprites.json');
    }

    function addShelf(x, y) {
        var item = game.add.sprite(x, y, 'shelf');
        item.data.polygon = 'shelf';
        item.anchor.set(0.5);

        items.push(item);
    }

    function addTrophy(sprite, polygon, x, y, style, score) {
        var item = game.add.sprite(x, y, sprite);
        item.data.polygon = polygon;
        item.data.score = score;
        item.anchor.set(0.5);

        var styles = [
            0xffff00,
            0xffffff,
            0xfc7d00
        ];

        item.tint = styles[style];

        trophies.push(item);
    }

    function addText(x, y) {
        var text = game.add.text(x, y, '', { font: "20px Arial",  fill: "#ffffff", align: "center" });
        text.stroke = '#000000';
        text.strokeThickness = 2;
        text.setShadow(2, 2, 'rgba(0,0,0,0.5)', 5);
        text.text = '';
        text.anchor.set(0.5);

        texts.push(text);
    }

    function addRandomTrophy(x, y) {
        var sizes = ['', 'm', 's'];
        var sizeScores = [100, 50, 25];
        var styleScores = [100, 50, 25];
        var style = game.rnd.integerInRange(0, 2);
        var size = game.rnd.integerInRange(0, 2);
        var type = game.rnd.integerInRange(1, 3);
        var score = sizeScores[size] + styleScores[style];
        addTrophy('trophy'+type+sizes[size], 'trophy'+type+sizes[size], x, y, style, score);
    }

    function addStuff() {
        addShelf(400, 400);

        addRandomTrophy(200, 450);
        addRandomTrophy(300, 450);
        addRandomTrophy(400, 450);
        addRandomTrophy(500, 450);
        addRandomTrophy(600, 450);

        addText(200, 450);
        addText(300, 450);
        addText(400, 450);
        addText(500, 450);
        addText(600, 450);
    }

    function createScoreText() {
        var scoreText = game.add.text(game.world.centerX, 60, '', { font: "30px Arial",  fill: "#ffffff", align: "center" });
        scoreText.stroke = '#000000';
        scoreText.strokeThickness = 2;
        scoreText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 5);
        scoreText.anchor.set(0.5);
        return scoreText;
    }

    function createButton() {
        var button = game.add.button(game.world.centerX, game.world.centerY, 'button', function() {
            if (goalReached) {
                game.state.start('Start', true, false, {levelSolved: levelData.level });
            }
        }, this, 2, 1, 0);

        button.alpha = 0;
        button.anchor.set(0.5);

        return button;
    }

    function create() {
        var background = game.add.sprite(0, 0, 'background');

        addStuff();

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 1000;
        game.physics.p2.updateBoundsCollisionGroup();
        game.physics.p2.enable(items.concat(trophies), false);

        var blockCollisionGroup = game.physics.p2.createCollisionGroup();

        items.forEach(function(item) {
            item.body.static = true;
            item.body.clearShapes();
            item.body.loadPolygon('physicsData', item.data.polygon);
            item.body.setCollisionGroup(blockCollisionGroup);
            item.body.collides([blockCollisionGroup]);
        });

        trophies.forEach(function(item) {
            item.body.clearShapes();
            item.body.loadPolygon('physicsData', item.data.polygon);
            item.body.setCollisionGroup(blockCollisionGroup);
            item.body.collides([blockCollisionGroup]);
        });

        mouseBody = new p2.Body();
        game.physics.p2.world.addBody(mouseBody);

        game.input.onDown.add(click, this);
        game.input.onUp.add(release, this);
        game.input.addMoveCallback(move, this);

        game.add.sprite(0, 0, 'curtain');

        scoreText = createScoreText();

        button = createButton();
    }

    function getTrophyUnderPointer(pointer) {
        var bodies = game.physics.p2.hitTest(pointer.position, trophies.map(function(item) { return item.body }));
        return bodies[0];
    }

    function dragTrophy(game, pointer, trophy) {
        var localPointInBody = [0, 0];
        var physicsPos = [game.physics.p2.pxmi(pointer.position.x), game.physics.p2.pxmi(pointer.position.y)];
        trophy.toLocalFrame(localPointInBody, physicsPos);
        mouseConstraint = game.physics.p2.createRevoluteConstraint(mouseBody, [0, 0], trophy, [game.physics.p2.mpxi(localPointInBody[0]), game.physics.p2.mpxi(localPointInBody[1]) ]);
    }

    function click(pointer) {
        var trophy = getTrophyUnderPointer(pointer);

        if (trophy && !goalReached)
        {
            dragTrophy(this.game, pointer, trophy);

            lifting = true;

            if (window.kongregate) {
                window.kongregate.stats.submit("Trophies lifted", 1);
            }
        }

    }

    function release() {
        lifting = false;
        game.physics.p2.removeConstraint(mouseConstraint);
    }

    function move(pointer) {
        mouseBody.position[0] = game.physics.p2.pxmi(pointer.position.x);
        mouseBody.position[1] = game.physics.p2.pxmi(pointer.position.y);
    }

    function update() {
        totalScore = 0;
        goalScore = 0;
        trophies.forEach(function(item, index) {
            var angleMultiplier = 1 - Math.abs(Math.round(item.angle)) / 180;

            var yMultiplier = 1 - item.y / 360;
            var yMultiplierCleaned = yMultiplier > 0 ? yMultiplier : 0;

            var calculatedScore = Math.round((angleMultiplier + yMultiplierCleaned) * item.data.score);
            if (yMultiplierCleaned == 0) {
                calculatedScore = 0;
            }
            var color = '#ffffff';
            if (calculatedScore > item.data.score) {
                color = '#00ff00';
            }
            totalScore += calculatedScore;
            texts[index].text = calculatedScore + ' / ' + item.data.score;
            texts[index].style.fill = color;
            goalScore += item.data.score * 1.25;
        });

        goalScore = Math.round(goalScore);

        scoreText.text = totalScore + ' / ' + goalScore;

        if (!lifting && totalScore >= goalScore) {
            button.alpha = 1;
            goalReached = true;
        }
        else {
            button.alpha = 0;
            goalReached = false;
        }
    }

    function render() {
    }

    return mainStage;
}

function getStartStage(game) {
    function addButton(x, y, level) {
        var button = game.add.button(x, y + 5, 'button', function() {
            game.state.start('Main', true, false, level);
        }, this, 2, 1, 0);

        button.alpha = 1;
        button.anchor.set(0.5);
        button.scale.x = 0.45;
        button.scale.y = 0.45;
        if (level.solved) {
            button.tint = 0x00ff00;
        }

        var levelText = game.add.text(x, y, '', { font: "20px Arial",  fill: "#ffffff", align: "center" });
        levelText.stroke = '#000000';
        levelText.strokeThickness = 2;
        levelText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 5);
        levelText.anchor.set(0.5);
        levelText.text = 'Level ' + level.level;
    }

    return {
        init: function(options) {
            if (options && options.levelSolved) {
                if (solvedLevels.indexOf(options.levelSolved) == -1) {
                    solvedLevels.push(options.levelSolved);
                    if (window.kongregate) {
                        window.kongregate.stats.submit("Level solved", 1);
                    }
                    if (localStorage) {
                        localStorage.setItem('trophyGameSolvedLevels', JSON.stringify(solvedLevels));
                    }
                }
            }
        },
        preload: function(){
            game.load.image('background', 'assets/sprites/background.png');
            game.load.spritesheet('button', 'assets/sprites/emptyButton.png', 300, 100);
        },
        create: function() {
            game.add.sprite(0, 0, 'background');
            var title = game.add.text(game.world.centerX, 80, '', { font: "60px Arial",  fill: "#ffffff", align: "center" });
            title.stroke = '#000000';
            title.strokeThickness = 2;
            title.setShadow(2, 2, 'rgba(0,0,0,0.5)', 5);
            title.anchor.set(0.5);
            title.text = 'TROPHY STACKER';

            var levels = [];

            for (var l = 1; l <= 30; l++ ) {
                levels.push({
                    level: l,
                    solved: solvedLevels.indexOf(l) > -1
                });
            }

            levels.forEach(function(level, index) {
                const y = Math.floor(index / 5);
                const x = index - y * 5;
                addButton(game.world.centerX - 300 + x * 150, 150 + y * 60, level);
            });
        },
        update: function() {

        },
        render: function() {

        }
    };
}

function startGame() {
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example');

    game.state.add('Main', getMainStage(game));
    game.state.add('Start', getStartStage(game));
    game.state.start('Start');
}

if (localStorage) {
    var savedSolvedLevels;
    try {
        savedSolvedLevels = JSON.parse(localStorage.getItem('trophyGameSolvedLevels'));
    } catch (e) {
        console.log(e);
    }

    if (savedSolvedLevels && Array.isArray(savedSolvedLevels)) {
        solvedLevels = savedSolvedLevels;
    }
}

startGame();

