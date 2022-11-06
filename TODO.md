# Core gameplay
 * ~~cascading (reveal adjacent 0 tiles and their neighbors)~~
 * ~~flags~~
 * ~~fix neighbor counts~~
 * ~~reset button~~ ~~turn `reset` button into `clear` (clears field) and `reset` (clears field & generates new mines)~~
 * ~~that thing where you press both left and right click and stuff happens~~
 * neighboring tile depress visual (NOT stepping)
 * ~~redesign RNG to be more pseudo. the initial start of the game feels needlessly rough, so it'd be nice to always start on a 0.~~
 * make the always-0-start code more efficient

# Code
 * **optimize code (lots of reused code throughout, unneeded variables, etc)**
 * add isFlag, setFlag, isHidden, setHidden, etc. with the goal of decoupling the logic from the rendered map

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
 * **proper minefield scaling**
 * better tile text (it's ugly ~~and too high~~)
 * better tile text colors (also fix the bug with them where sometimes a color is not found)
 * cute minefield border
 * less unappealing page design
 * fix gross tile hover transition (especially the z-index)
 * fix 'you died' text being out of position
 * **add cats!!**
