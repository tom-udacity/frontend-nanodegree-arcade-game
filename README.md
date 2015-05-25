Udacity Project 3 - Frogger type game
=====================================

# Installation instructions
Download all files, then drag the "index.html" file to your HTML 5 compatible browser.

# How to play

The game screen has:
- grass (the safe zone)
- 3 rows of road
- 3 bugs, moving at random speeds in random sections
- 1 boulder blocking your path
- 2 gems for extra points
-water (your goal)

To collect points, you get:
- +50 points for reaching the water
- +25 points each for collecting gems
- -25 points for each bug collision

The screen will reset each time you reach the water or are hit by a bug.

# Notes on items added for fun in addition to the requirements

The score is displayed on the canvas

A game clock displays the elapsed time since the game started on the canvas, but does not contribute to the game at all.

Sounds added for feedback.

The rock and gem items use the "MapObjects" parent for common functionality.
