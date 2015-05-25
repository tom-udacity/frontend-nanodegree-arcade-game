'use strict';

/* Global variables */
var MAX_COLUMNS = 4;
var MAX_ROWS = 5;
var BLOCK_WIDTH = 101;
var BLOCK_HEIGHT = 83;
var CANVAS_WIDTH = ((MAX_ROWS + 1) * BLOCK_WIDTH);
var SCORE = 0;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.heightOffset = -25;
    this.minSpeed = 125;
    this.maxSpeed = 400;

    this.x = 0;
    this.row = 0;
    this.speed = 0;
    
    // maxDistance moves the enemy off canvas for a random distance, acting as a delay before resetting
    this.maxDistance = 0;

    this.reset();
};

Enemy.prototype.reset = function() {
    this.x = 0;
    this.row = Math.floor((Math.random() * 3) + 1);
    this.speed = Math.floor((Math.random() * (this.maxSpeed - this.minSpeed)) + this.minSpeed);
    this.maxDistance = CANVAS_WIDTH + Math.floor((Math.random() * 150) + 25);   // moves a bit further off canvas
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, player) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += (this.speed * dt);

    if (this.x > this.maxDistance) {
        this.reset();
    }

    this.detectCollisions(player);

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function(ctx) {
    ctx.drawImage(Resources.get(this.sprite), this.x, (this.row * BLOCK_HEIGHT) + this.heightOffset);
};

// Detect collisions
Enemy.prototype.detectCollisions = function(player) {
    if (this.row === player.row) {
        var playerX = player.column * BLOCK_WIDTH;
        var xDiff = Math.abs(playerX - this.x);
        if (xDiff < 74) {
            document.getElementById('collision_sound').play();
            SCORE -= 25;
            player.reset();
        }
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.heightOffset = -35;
    this.column = 2;
    this.row = 4;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.reset = function() {
    this.column = 2;
    this.row = 4;
};

Player.prototype.update = function(dt) {
};

Player.prototype.render = function(ctx) {
    ctx.drawImage(Resources.get(this.sprite), this.column * BLOCK_WIDTH, (this.row * BLOCK_HEIGHT) + this.heightOffset);
};
Player.prototype.handleInput = function(keyString, RandomObjectManager) {

    if (keyString === 'up') {

        if (this.row > 0) {
            if (RandomObjectManager.checkObjectAtLocation(this.column, this.row - 1)) {
                this.row -= 1;

                if (this.row === 0) {
                    document.getElementById('success_sound').play();
                    SCORE += 50;
                    resetGame();
                } else {
                    document.getElementById('move_sound').play();
                }
            }
        }

    } else if (keyString === 'down') {

        if (this.row < MAX_ROWS && RandomObjectManager.checkObjectAtLocation(this.column, this.row + 1)) {
            this.row += 1;
            document.getElementById('move_sound').play();
        }

    } else if (keyString === 'left') {

        if (this.column > 0 && RandomObjectManager.checkObjectAtLocation(this.column - 1, this.row)) {
            --this.column;
            document.getElementById('move_sound').play();
        }

    } else if (keyString === 'right') {

        if (this.column < MAX_COLUMNS && RandomObjectManager.checkObjectAtLocation(this.column + 1, this.row)) {
            this.column += 1;
            document.getElementById('move_sound').play();
        }

    }

};


// Superclass for Rocks and Gems
var MapObject = function() {};

MapObject.prototype = {
    heightOffset: -28,
    column: 0,
    row: 0,
    sprite: '',
    blocksMovement: false,
    points: 0,
    
    update: function() {},
    
    render: function(ctx) {
        ctx.drawImage(Resources.get(this.sprite), this.column * BLOCK_WIDTH, (this.row * BLOCK_HEIGHT) + this.heightOffset);
    },
};



// Rock object
var Rock = function() {
    this.sprite = 'images/Rock.png';
    this.heightOffset = -28;
    this.blocksMovement = true;
};

Rock.prototype = Object.create(MapObject.prototype);


// Gem object
var Gem = function() {
    // Assign a color & point value
    var color, points, gemType = Math.floor((Math.random() * 3));
    switch (gemType) {
    case 0:
        color = 'Blue';
        points = 40;
        break;
    case 1:
        color = 'Green';
        points = 30;
        break;
    case 2:
        color = 'Orange';
        points = 25;
        break;
    }
    
    this.sprite = 'images/Gem ' + color + '.png';
    this.heightOffset = -35;
    this.blocksMovement = false;
    this.points = points;
};

Gem.prototype = Object.create(MapObject.prototype);


// This manages all Rock and Gem objects
var RandomObjectManager = {
    objectArray: [],
    
    reset: function() {
        var idx, mapObject;
        
        this.objectArray = [];   // remove existing objects
        
        // Add rocks
        var rockCount = Math.floor(Math.random() * 3);
        for (idx=0; idx <= rockCount; idx++) {
            mapObject = new Rock();
            this.setRandomLocation(mapObject);
            this.objectArray.push(mapObject);
        }
        
        // Add gems
        var gemCount = Math.floor(Math.random() * 3);
        for (idx=0; idx <= gemCount; idx++) {
            mapObject = new Gem();
            this.setRandomLocation(mapObject);
            this.objectArray.push(mapObject);
        }
        
    },
    
    setRandomLocation: function(newObject) {
        var locationIsUnique = false;
        var i, object;

        while (!locationIsUnique) {

            locationIsUnique = true;
            newObject.row = Math.floor((Math.random() * 3) + 1); // result s/b rows 1-3
            newObject.column = Math.floor(Math.random() * (MAX_COLUMNS + 1));

            // Check if another newObject already exists in the same location
            i = 0;
            while (i < this.objectArray.length) {
                object = this.objectArray[i];
                if (object !== newObject && object.row === newObject.row && object.column === newObject.column) {
                    locationIsUnique = false;
                    break;
                }
                ++i;
            }

        }
    },
    
    render: function(ctx) {
        var i;
        for (i=0; i<this.objectArray.length; i++) {
            this.objectArray[i].render(ctx);
        }
    },
    
    checkObjectAtLocation: function(column, row) {
        var object = null, i = 0, canMoveHere = true;
        
        while (i < this.objectArray.length) {
            object = this.objectArray[i];
            if (object.row === row && object.column === column) {

                if (object.blocksMovement) {
                    document.getElementById('blocked_sound').play();
                    canMoveHere = false;
                    break;
                } else if (object.points > 0) {
                    object.row = -10; // hide offscreen until the next reset
                    SCORE += object.points;
                    document.getElementById('bonus_sound').play();
                    break;
                }

            }
            ++i;
        }

        return canMoveHere; // no object found
    }
};

//Reset the screen after success or collision
function resetGame() {
    player.reset();
    RandomObjectManager.reset();
}

// Now instantiate your objects.
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();
resetGame();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode], RandomObjectManager);
});

