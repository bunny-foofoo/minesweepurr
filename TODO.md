# Core gameplay
 * ~~cascading (reveal adjacent 0 tiles and their neighbors)~~
 * ~~flags~~
 * ~~fix neighbor counts~~
 * ~~reset button~~ ~~turn `reset` button into `clear` (clears field) and `reset` (clears field & generates new mines)~~
 * ~~that thing where you press both left and right click and stuff happens~~
 * ~~neighboring tile depress visual (NOT stepping)~~
 * ~~redesign RNG to be more pseudo. the initial start of the game feels needlessly rough, so it'd be nice to always start on a 0.~~
 * make the always-0-start code more efficient
 * clean up the game, making it more first time user-friendly and less dev-modey
 * mobile controls ( and make mobile tiles larger )

# Code
 * optimize and clean js (lots of reused code throughout, unneeded variables, etc)
 * add ~~isFlag, setFlag, isHidden, setHidden~~, etc. with the goal of decoupling the logic from the rendered map
 * refactor middle mouse functionality a little. it's kind of messy and the listener set up is a little wonk.
 * fix middle mouse highlighting with different view mode (wider style breaks it for some reason)
 * clean up CSS

# Extra functionality
 * minefield size settings
 * mine frequency settings

# Creation mode
 * ~~mode toggle button~~
 * ~~the mode itself~~
 * ~~`hide` button~~

# Solver
 * port python code
 * optimize algorithm (fix method1 too)
 * ~~autosolve button~~
 * time slider ~~& slowed visuals~~ to see what the solver is doing as it goes
 * decide on a way for it to start (should it really just risk immediate death?)
 * add more logic for when the primary solver hits a dead end

# Aesthetics
 * ~~tile hover color~~
 * tile reveal effects
 * game over effects
 * proper minefield scaling
 * ~~better tile text (it's ugly and too high)~~
 * better tile text colors ~~(also fix the bug with them where sometimes a color is not found)~~
 * cute minefield border (or maybe just a glowy squircle around it)
 * ~~less unappealing page design~~
 * ~~fix gross tile hover transition (especially the z-index)~~
 * ~~fix 'you died' text being out of position~~
 * **add cats!!**
 * ~~make the extra buttons slide down, instead of just appearing to the side~~

 * Reduce the cartoony vibe
	* Less cartoony font
	* Less rounded text
	* Less rounded buttons
		* Re order to reset solve edit? seems better for arrangement based on priority/usage freq
	* Not cartoony cats
	* Easy on the eyes, not color clashing sweeper board
		* ~~Enough contrast between outer (hidden) and under (normal) colors to differentiate easily~~
		* Flag colors that do not clash
		* Text label color gradient that doesn't clash and is accessible
 * ~~Give it more of a chill, dark style~~
 * Better indicator for paint mode being on
 * Remove or redesign most buttons to be very new person friendly
