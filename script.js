const HEIGHT = 20;
const WIDTH = 20;

const minefield = document.querySelector('.minefield');
const sub = document.querySelector('.sub')

const NORMALCOLOR1 = '#dcd6d6';
const NORMALCOLOR2 = '#cbc0c8';


const HIDDENCOLOR1 = 'rgb(84, 76, 76)'; // #544c4c
const HIDDENCOLOR2 = 'rgb(62, 59, 59)'; // #3e3b3b

const MINEASCII = 'ϴ';
const MINECOLOR = 'rgb(194, 50, 62)'; // #450000 orig // rgb(94, 50, 237) poipol

const FLAGCOLOR1 = 'rgb(212, 134, 34)'; // LIGHTER FLAG
const FLAGCOLOR2 = 'rgb(206, 127, 25)'; // DARKER  FLAG
// Contrasting set: FLAG1 (#e69225) | FLAG2 (#cc7b12)
// More subtle set: FLAG1 (#D48622) | FLAG2 (#CE7F19)

const COLORS = [
	'rgba(0,0,0,0)',
	'rgb(24, 137, 230)',
	'rgb(19, 205, 146)',
	'rgb(46, 215, 16)',
	'rgb(124, 153, 36)',
	'rgb(176, 126, 2)',
	'rgb(176, 31, 2)',
	'rgb(224, 77, 226)',
	'rgb(129, 34, 230)',
]

let GG = false;
const PLANTSPEED = 0;
const NUMMINES = 50;

let currentMines = 0;
let flagsUsed = 0;

let freshStart = true;
let freshPaint = false;

let painting = false;

const SOLVESPEED = 250;
const GGSPEED = 0;

let generateButton;
let resetButton;
let solveButton;
let autoSolveButton;
let paintButton;
let revealButton;
let clearButton;
let solverButton;

let hoverTile = null;

let solverMode = false;

let middleMouseDown = false;

const getXY = tile => {
	const splitId = tile.id.split('_');
	return [ parseInt(splitId[2]), parseInt(splitId[1]) ]
}

const loopNeighbors = (tile, func) => {
	let [ x, y ] = getXY(tile);
	for (let i = 0; i < 3; i++) {
		// ensure we're not going to access a negative or out of range index
		let _y = y + (i - 1);
		if (0 <= _y && _y < HEIGHT) {
			for (let j = 0; j < 3; j++) {
				// ensure we're not going to access a negative or out of range index
				let _x = x + (j - 1);
				if (0 <= _x && _x < WIDTH) {
					let idStr = `#tile_${_y}_${_x}`;
					neighby = document.querySelector(idStr);
					func(neighby);
				}
			}
		}
	}
}

const makeVisible = tile => {
	//tile.style.fontSize = '1em';
	let [ x, y ] = getXY(tile);
	if (tile.innerText == MINEASCII) {
		tile.style.backgroundColor = MINECOLOR;
	} else {
		tile.style.backgroundColor = ((x + y) % 2 == 0) ? NORMALCOLOR1 : NORMALCOLOR2;
		let nval = parseInt(tile.innerText)
		tile.style.color = COLORS[nval];
	}
}

const makeHidden = tile => {
	//tile.style.fontSize = '0em';
	tile.style.color = 'rgba(0,0,0,0)';
	let [ x, y ] = getXY(tile);
	tile.style.backgroundColor = ((x + y) % 2 == 0) ? HIDDENCOLOR1 : HIDDENCOLOR2; 
}

const isHidden = tile => {
	return tile.style.backgroundColor == HIDDENCOLOR1 || tile.style.backgroundColor == HIDDENCOLOR2;;
}

const gameover = () => {
	GG = true;
	sub.style.color = 'rgb(255, 145, 225)';
	sub.innerText = 'you died!';
	revealAllMines();
}

const checkWin = () => {
	let tiles = document.querySelectorAll('.tile');
	let win = true;
	for (let i = 0; i < tiles.length; i++) {
		let tile = tiles[i];
		if (tile.innerText == MINEASCII && !isFlagged(tile)) {
			win = false;
			break;
		}
	}
	if (win) {
		sub.style.color = 'rgb(0, 255, 0)';
		sub.innerText = 'you won!';
	}
}

const updateFlagText = () => {
	sub.innerText = `${currentMines - flagsUsed} flags left`;
	// set sub color as a gradient
	// from white to red
	// based on flagsUsed / currentMines
	let percent = flagsUsed / currentMines;
	let r = Math.floor(140 + (255 * percent));
	let g = Math.floor(31 + (255 * percent));
	let b = Math.floor(43 + (255 * percent));
	let color = `rgb(${r}, ${g}, ${b})`;
	sub.style.color = color;
}

const setFlag = tile => {
	if (flagsUsed == currentMines) return;
	flagsUsed++;
	updateFlagText();
	let [ x, y ] = getXY(tile)
	tile.style.backgroundColor = ((x + y) % 2 == 0) ? FLAGCOLOR1 : FLAGCOLOR2;
	if (flagsUsed == currentMines) {
		checkWin();
	}
}

const isFlagged = tile => {
	return tile.style.backgroundColor == FLAGCOLOR1 || tile.style.backgroundColor == FLAGCOLOR2;
}

const countNeighbors = tile => {
	let dangerCount = 0;
	loopNeighbors(tile, (neighbor => {
		if (neighbor.innerText == 'x') {
			dangerCount++;
		}
	}));
	return dangerCount;
}

const incrementNeighbors = tile => {
	loopNeighbors(tile, (neighbor => {
		if (neighbor.innerText != MINEASCII) {
			let nval = parseInt(neighbor.innerText)
			neighbor.innerText = nval + 1;
			// neighbor.style.color = COLORS[nval];
		}
		// this adds an interesting behavior where pressing `reset` while painting
		// will cause a new minefield to generate with all tiles (except 0) revealed
		if (painting) makeVisible(neighbor);
	}));
}

const plant = (x, y) => {
	const tile = document.querySelector(`#tile_${y}_${x}`);
	if (tile.innerText != MINEASCII) {
		tile.innerText = MINEASCII;
		// tile.style.color = 'rgb(0, 0, 0)'
		tile.style.color = 'rgba(0,0,0,0)';
		//tile.style.backgroundColor = MINECOLOR;
		incrementNeighbors(tile);
		currentMines++;
		return true;
	}
	return false;
}

const plantMines = async () => {
	for (let m = 0; m < NUMMINES; m++) {
		if (currentMines == HEIGHT * WIDTH) return;
		let rx = Math.floor(Math.random() * WIDTH);
		let ry = Math.floor(Math.random() * HEIGHT);
		let planted = plant(rx, ry);
		if (planted) {
			if (PLANTSPEED != 0) await new Promise(r => setTimeout(r, PLANTSPEED));
		} else {
			m--;
		}
	}
}

const clearNeighbors = tile => {
	loopNeighbors(tile, (neighbor => {
		// uncomment to disallow cascades from removing flags
		// if (neighbor.style.backgroundColor == FLAGCOLOR) continue;

		let wasHidden = isHidden(neighbor);
		let wasZero = neighbor.innerText == '0';

		makeVisible(neighbor);

		if (wasHidden && wasZero) {
			neighbor.style.color = 'rgba(0,0,0,0)';
			clearNeighbors(neighbor);
		}
	}));
}

const revealAllMines = async () => {
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			const tile = document.querySelector(`#tile_${i}_${j}`);
			makeVisible(tile);
			if (tile.innerText == MINEASCII && GGSPEED != 0) {
				await new Promise(r => setTimeout(r, GGSPEED));
			} //else if (tile.innerText == '0') {
				//tile.style.fontSize = '0em';
			//}
		}
	}
}

const clickEvent = e => {
	if (GG) return;

	freshPaint = false;
	
	if (freshStart) {
		while (e.target.innerText != 0) {
			clearField();
			plantMines();
		}
		freshStart = false;
	}
	
	if (painting) {
		let [ x, y ] = getXY(e.target)
		updateFlagText();
		return plant(x, y);
	}
	
	if (isFlagged(e.target)) return;
	
	if (e.target.innerText == MINEASCII) {
		// clicked on a mine
		gameover();
	} else {
		if (!isHidden(e.target)) return;
		setAutoState(true);
		if (e.target.innerText != '0') {
			e.target.style.color = COLORS[parseInt(e.target.innerText) - 1];
			makeVisible(e.target);
		} else {
			clearNeighbors(e.target);
		}
	}
}

const mousein = (e, outline = 1) => {
	if (GG) return;
	// e.target.style.outline = `${outline}px solid grey`;
	e.target.style.zIndex = 5 ;
	if (outline != 1) {
		e.target.style.filter = 'brightness(1.075)';
	}
	if (!isHidden(e.target)) {
		e.target.style.zIndex = 15;
	}
}

const mouseout = e => {
	e.target.style.outline = '';
	e.target.style.zIndex = 20;
	e.target.style.filter = '';
	loopNeighbors(e.target, (neighbor => {
		loopNeighbors(neighbor, (n2 => {
			n2.style.zIndex = 10;
		}));
	}));
}

const rightclick = e => {
	e.preventDefault();

	let tile = e.target

	if (isHidden(tile)) {
		setFlag(tile);
	} else if (isFlagged(tile)) {
		makeHidden(tile);
		flagsUsed--;
	}
 
	return false;
}

const middleReveal = tile => {
	if (isHidden(tile) || isFlagged(tile)) return;

	// number of neighboring flags
	let tileVal = parseInt(tile.innerText)
	let flagCount = 0;
	let neighbors = [];

	loopNeighbors(tile, (neighbor => {
		if (isFlagged(neighbor)) {
			flagCount++;
		} else {
			neighbors.push(neighbor);
		}

		if (flagCount > tileVal) return;
	}))
	
	if (flagCount != tileVal) return;

	neighbors.forEach(neighby => {
		if (neighby.innerText == MINEASCII) {
			// revealed a mine
			gameover();
		} else {
			if (neighby.innerText != '0') {
				neighby.style.color = COLORS[parseInt(neighby.innerText) - 1];
				makeVisible(neighby);
			} else {
				clearNeighbors(neighby);
			}
		}
	});
}

const highlightNeighbors = tile => {
	//if (isHidden(tile) || isFlagged(tile)) return;

	loopNeighbors(tile, (neighbor => {
		if (isHidden(neighbor)) {
			mousein({target: neighbor}, 0);
		}
	}));
}

const unhighlightNeighbors = tile => {
	//if (isHidden(tile) || isFlagged(tile)) return;

	loopNeighbors(tile, (neighbor => {
		mouseout({target: neighbor});
	}));
}

const moveAndScaleHoverTile = (tile) => {
	let [ x, y ] = getXY(tile);
	// below is a disgusting mess
	// in a gist, it scales the hover tile's size based on how many tiles it should cover
	// and offsets it accordingly

	// when imagining a 3x3 grid around the tile which currently has the mouse over it,
	// `tile` represents the center tile (with mouse over it)
	// `tile2` represents the top left tile (up 1, left 1)
	// `tile3` represents the bottom right tile (down 1, right 1)
	
	let tileSize = tile.offsetWidth; // height will be the same 
	let offsetLeft = tile.offsetLeft - 0;
	let offsetTop = tile.offsetTop - 0;
	let width = tileSize;
	let height = tileSize;
	let y2 = Math.max(y - 1, 0);
	let x2 = Math.max(x - 1, 0);
	let tile2 = document.querySelector(`#tile_${y2}_${x2}`); // top left
	// not hugging the left edge
	if (x != x2) {
		offsetLeft = tile2.offsetLeft;
		width += tile2.offsetWidth;
	}
	// not hugging the top edge
	if (y != y2) {
		offsetTop = tile2.offsetTop;
		height += tile2.offsetHeight;
	}
	let y3 = Math.min(y + 1, HEIGHT - 1);
	let x3 = Math.min(x + 1, WIDTH - 1);
	let tile3 = document.querySelector(`#tile_${y3}_${x3}`); // bottom right
	// not hugging the right edge
	if (x != x3) {
		width += tile3.offsetWidth;
	}
	// not hugging the bottom edge
	if (y != y3) {
		height += tile3.offsetHeight;
	}
	hoverTile.style.left = `${offsetLeft}px`;
	hoverTile.style.top = `${offsetTop}px`;
	hoverTile.style.width = `${width}px`;
	hoverTile.style.height = `${height}px`;
	hoverTile.style.visibility = middleMouseDown ? 'visible' : 'hidden';
}


const middleclick = e => {
	if (e.button != 1) return;

	let tile = e.target
	middleReveal(tile);
}

const initTiles = () => {
	// fill minefield with tiles
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			const tile = document.createElement('div');
			tile.classList.add('tile');
			tile.id = `tile_${i}_${j}`;
			tile.innerText = '0';

			// checkerboard color
			makeHidden(tile);
			
			tile.addEventListener('click', clickEvent);
			tile.addEventListener('contextmenu', rightclick);
			tile.addEventListener('mouseenter', mousein);
			tile.addEventListener('mouseleave', mouseout);
			tile.addEventListener('auxclick', middleclick);
			// event listener for middle mouse down
			tile.addEventListener('mousedown', e => {
				if (e.button != 1) return;
				middleMouseDown = true;
				highlightNeighbors(tile);
				moveAndScaleHoverTile(tile);
			});
			// event listener for middle click up
			tile.addEventListener('mouseup', e => {
				if (e.button != 1) return;
				middleMouseDown = false;
				unhighlightNeighbors(tile);
				moveAndScaleHoverTile(tile);
			});

			if (hoverTile == null) {
				hoverTile = document.createElement('div');
				hoverTile.classList.add('hoverTile');
				document.body.appendChild(hoverTile);
			}

			tile.addEventListener('mouseleave', e => {
				unhighlightNeighbors(e.target);
			});
			tile.addEventListener('mouseenter', e => {
				if (middleMouseDown) highlightNeighbors(e.target);
				moveAndScaleHoverTile(e.target);

			});

			minefield.appendChild(tile);
		}
	}
}

const clearField = (reveal = false) => {
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			const tile = document.querySelector(`#tile_${i}_${j}`);
			tile.innerText = '0';
			if (reveal) {
				makeVisible(tile);
				// tile.style.fontSize = '0em';
			} else {
				makeHidden(tile);
			}

		}
	}
	currentMines = 0;
	flagsUsed = 0;
	GG = false;
	sub.innerText = '​';
}

const togglePainting = e => {
	freshStart = false;
	painting = !painting;
	if (!painting) {
		for (let i = 0; i < HEIGHT; i++) {
			for (let j = 0; j < WIDTH; j++) {
				const tile = document.querySelector(`#tile_${i}_${j}`);
				makeHidden(tile);
			}
		}
		freshPaint = true;
		setAutoState(true);
	}
	generateButton.style.visibility = (!painting) ? 'hidden' : 'visible';
	clearButton.style.visibility = (!painting) ? 'hidden' : 'visible';
	//e.target.style.backgroundColor = painting ? 'green' : 'rgb(179, 103, 144)';
}

const solveOnce = () => {
	let newFlags = 0;
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			const tile = document.querySelector(`#tile_${i}_${j}`);
			
			if (isHidden(tile) || isFlagged(tile)) continue;

			let hiddenNeighbors = 0;
			let flaggedNeighbors = 0;

			let tileVal = parseInt(tile.innerText)

			loopNeighbors(tile, (neighbor => {
				if (isHidden(neighbor)) hiddenNeighbors++;
				if (isFlagged(neighbor)) flaggedNeighbors++;
			}))

			if (tileVal == (hiddenNeighbors + flaggedNeighbors)) {
				loopNeighbors(tile, (neighbor => {
					if (isHidden(neighbor)) {
						setFlag(neighbor)
						newFlags++;
					};
				}))
			}
		}
	}
	return newFlags;
}

const revealOnce = () => {
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			const tile = document.querySelector(`#tile_${i}_${j}`);
			middleReveal(tile);
		}
	}
}

const setAutoState = (enabled) => {
	if (enabled) {
		autoSolveButton.style.backgroundColor = 'rgb(230, 172, 48)';
	} else {
		autoSolveButton.style.backgroundColor = 'rgb(120, 43, 28)';
	}
}

const autoSolve = async () => {
	if (freshStart || freshPaint) {
		// select a random tile if the map hasn't been touched yet
		let foundZero = false;
		let attempts = 0;
		let tile, x, y;
		while (!foundZero && attempts < 50) {
			attempts++;
			x = Math.floor(Math.random() * WIDTH);
			y = Math.floor(Math.random() * HEIGHT);
			tile = document.querySelector(`#tile_${y}_${x}`);
			foundZero = tile.innerText == '0';
		}
		clickEvent({target: tile});
	}
	let flags;
	let failedAttempts = 0;
	while (failedAttempts < 2) {
		revealOnce();
		flags = solveOnce();
		if (flags == 0) {
			failedAttempts++;
		} else {
			failedAttempts = 0;
			if (SOLVESPEED != 0) await new Promise(r => setTimeout(r, SOLVESPEED));
		}
	}
	setAutoState(false);
}

const solverToggle = () => {
	solverMode = !solverMode;
	//solverButton.style.backgroundColor = solverMode ? 'rgb(217, 94, 46)' : 'rgb(179, 103, 144)';
	revealButton.style.visibility = (!solverMode) ? 'hidden' : 'visible';
	solveButton.style.visibility = (!solverMode) ? 'hidden' : 'visible';
	autoSolveButton.style.visibility = (!solverMode) ? 'hidden' : 'visible';
}

clearButton = document.querySelector('.clear');
clearButton.addEventListener('click', () => {
	clearField(true);
});

resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', () => {
	freshStart = true;
	setAutoState(true);
	clearField();
	plantMines();
});

generateButton = document.querySelector('.generate');
generateButton.addEventListener('click', plantMines);

paintButton = document.querySelector('.paint');
paintButton.addEventListener('click', togglePainting);

solveButton = document.querySelector('.solve');
solveButton.addEventListener('click', solveOnce);

revealButton = document.querySelector('.reveal');
revealButton.addEventListener('click', revealOnce);

autoSolveButton = document.querySelector('.autosolve');
autoSolveButton.addEventListener('click', autoSolve);

solverButton = document.querySelector('.solver');
solverButton.addEventListener('click', solverToggle);

initTiles();
if (!painting) plantMines();
sub.innerText = '​';