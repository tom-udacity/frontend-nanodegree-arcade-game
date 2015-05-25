/* Global variables */
var MAX_COLUMNS = 4;
var MAX_ROWS = 5;
var BLOCK_WIDTH = 101;
var BLOCK_HEIGHT = 83;	// 171
var CANVAS_WIDTH = ( (MAX_ROWS+1) * BLOCK_WIDTH);
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
	this.maxDistance = 0;	// moves the enemy off canvas for a random distance, acting as a delay before resetting
	
	this.reset();
}

Enemy.prototype.reset = function() {
	this.x = 0;
	this.row = Math.floor((Math.random() * 3) + 1);
	this.speed = Math.floor((Math.random() * (this.maxSpeed-this.minSpeed)) + this.minSpeed);
	this.maxDistance = CANVAS_WIDTH + Math.floor((Math.random() * (CANVAS_WIDTH>>2)) + 25); // canvas length + 25 to 177
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	
	this.x += (this.speed * dt);
	
	if (this.x > this.maxDistance) {
		this.reset();
	}
	
	this.detectCollisions();
	
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, (this.row * BLOCK_HEIGHT) + this.heightOffset);
}

// Detect collisions
Enemy.prototype.detectCollisions = function() {
	if (this.row === player.row) {
		var playerX = player.column * BLOCK_WIDTH;
		var xDiff = Math.abs(playerX - this.x);
		if (xDiff < 74) {
			onCollision();
		}
	}
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	this.heightOffset = -35;
	this.column = 2;
	this.row = 4;
	this.sprite = 'images/char-boy.png';
}

Player.prototype.reset = function() {
	this.column = 2;
	this.row = 4;
}


Player.prototype.update = function(dt) {
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.column * BLOCK_WIDTH, (this.row * BLOCK_HEIGHT) + this.heightOffset);
}

Player.prototype.handleInput = function(keyString) {
	
	if (keyString=== 'up') {
		
		if (this.row > 0) {
			if (checkObjectAtLocation(this.column, this.row-1)) {
				--this.row;
				
				if (this.row === 0) {
					onSuccess();
				} else {
					document.getElementById('move_sound').play();					
				}
			}
		}
			
	} else if (keyString === 'down') {
		
		if (this.row < MAX_ROWS && checkObjectAtLocation(this.column, this.row+1)) {
			++this.row;
			document.getElementById('move_sound').play();					
		}
		
	} else if (keyString === 'left' ) {
		
		if (this.column > 0 && checkObjectAtLocation(this.column-1, this.row)) {
			--this.column;
			document.getElementById('move_sound').play();					
		}
		
	} else if (keyString === 'right' ) {
		
		if (this.column < MAX_COLUMNS && checkObjectAtLocation(this.column+1, this.row)) {
			++this.column;
			document.getElementById('move_sound').play();					
		}
		
	}

}


// Super class for Rocks and Gems
var MapObjects = function() {
	this.heightOffset = -35;
	this.column = 0;
	this.row = 0;
	this.sprite = '';
	this.blocksMovement = false;
	this.points = 0;
}

MapObjects.prototype.reset = function() {
	this.setRandomLocation();
}

// Set a random location for the object
MapObjects.prototype.setRandomLocation= function() {
	var locationIsUnique = false;
	
	while (!locationIsUnique) {
	
		locationIsUnique = true;
		this.row = Math.floor( (Math.random() * 3) + 1);	// result s/b rows 1-3
		this.column = Math.floor(Math.random() * (MAX_COLUMNS+1) );
	
		// Check if another object already exists in the same location
		for (var i=0; i<allExtraObjects.length; i++) {
			extraObj = allExtraObjects[i];
			if (extraObj != this && extraObj.row === this.row && extraObj.column === this.column) {
				locationIsUnique = false; 
			}
		}
		
	}

}

MapObjects.prototype.update = function(dt) {
}

MapObjects.prototype.render = function() {
 	ctx.drawImage(Resources.get(this.sprite), this.column * BLOCK_WIDTH, (this.row * BLOCK_HEIGHT) + this.heightOffset);
}


// Rock object
var Rock = function() {
	this.setRandomLocation();
	this.sprite = 'images/Rock.png';
	this.heightOffset = -28;
	this.blocksMovement = true;
}

Rock.prototype = Object.create(MapObjects.prototype);


// Gem object
// Only "Blue", "Green", and "Orange" are valid
var Gem = function(color) {
	this.setRandomLocation();
	this.sprite = 'images/Gem ' + color + '.png';
	this.heightOffset = -35;
	this.blocksMovement = false;
	this.points = 25;
}

Gem.prototype = Object.create(MapObjects.prototype);


// Check if an object exists at a location
function checkObjectAtLocation(column, row) {
	var object = null, i;
	
	for (i=0; i<allExtraObjects.length; i++) {
		object = allExtraObjects[i];
		if (object.row === row && object.column === column) {

			if (object instanceof Rock) {
				document.getElementById('blocked_sound').play();					
				return false;	// cannot move here
			} else if (object instanceof Gem) {
				object.row = -10;	// hide offscreen until the next reset
				SCORE += object.points;
				document.getElementById('bonus_sound').play();
				return true;
			}
			
		}
	}
	
	return true;	// no object found
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// The allExtraObjects variable must exist before adding objects for the duplicate location check.
// Objects must be added one at a time as each one will loop through allExtraObjects looking for a unique location.
var allExtraObjects = [];
allExtraObjects.push(new Rock());
allExtraObjects.push(new Gem('Blue'));
allExtraObjects.push(new Gem('Orange'));

var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37 : 'left',
		38 : 'up',
		39 : 'right',
		40 : 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});

// Made it to the water
function onSuccess() {
	document.getElementById('success_sound').play();					
	SCORE += 50;
	resetGame();
}

// Hit by an enemy
function onCollision() {
	document.getElementById('collision_sound').play();					
	SCORE -= 25;
	resetGame();
}

// Reset the screen after success or collision
function resetGame() {
	player.column = 2;
	player.row = 4;
	
	allExtraObjects.forEach(function(extraObj) {
		extraObj.reset();
    });
}
