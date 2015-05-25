Udacity Project 3 - Frogger type game
=====================================

# Installation instructions
Download all files, then drag the "index.html" file to your HTML 5 compatible browser.

# How to play

The game screen has:
- grass (the safe zone)
- 3 rows of road
- 3 bugs, moving at random speeds in random sections
- water (your goal)
- up to 3 boulders blocking your path
- up to 3 gems to collect extra points

To collect points, you get:
- +50 points for reaching the water
- +30 for collecting a blue gem
- +20 for collecting a green gem
- +10 for collecting a orange gem
- -25 points for each bug collision

The screen will reset each time you reach the water.

# Notes on items added for fun in addition to the requirements

The score is displayed on the canvas

A game clock displays the elapsed time since the game started on the canvas, but does not contribute to the game at all.

Sounds added for feedback.

The rock and gem items use the "MapObject" parent for common functionality.

The RandomObjectManager:
- manages an array of "MapObjects"s
- assigns random locations for each object
- checks for collisions against objects, awarding points for gems and determines if a player can move to a block

The new version does not use any global variables.
