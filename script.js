const HEIGHT = 20;
const WIDTH = 20;

const minefield = document.querySelector('.minefield');
const sub = document.querySelector('.sub')

const NORMALCOLOR1 = '#dcd6d6';
const NORMALCOLOR2 = '#cbc0c8';


const HIDDENCOLOR1 = 'rgb(84, 76, 76)'; // #544c4c
const HIDDENCOLOR2 = 'rgb(62, 59, 59)'; // #3e3b3b

const MINEASCII = 'ϴ';
const MINECOLOR = '#450000';

const FLAGCOLOR = 'rgb(230, 146, 37)'; // #e69225

const COLORS = [
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

let painting = false;

const makeVis = tile => {
	tile.style.fontSize = '1em';
	const splitId = tile.id.split('_');
	const y = parseInt(splitId[1]);
	const x = parseInt(splitId[2]);
	if (tile.innerText == MINEASCII) {
		tile.style.backgroundColor = MINECOLOR;
	} else {
		tile.style.backgroundColor = ((x + y) % 2 == 0) ? NORMALCOLOR1 : NORMALCOLOR2;
	}
}

const makeInvis = tile => {
	tile.style.fontSize = '0em';
	const splitId = tile.id.split('_');
	const y = parseInt(splitId[1]);
	const x = parseInt(splitId[2]);
	tile.style.backgroundColor = ((x + y) % 2 == 0) ? HIDDENCOLOR1 : HIDDENCOLOR2; 
}

const countNeighbors = tile => {
	const splitId = tile.id.split('_');
	const y = parseInt(splitId[1]);
	const x = parseInt(splitId[2]);

	// num mines nearby
	let dangerCount = 0;

	for (let i = 0; i < 3; i++) {
		// ensure we're not going to access a negative or out of range index
		let _y = y + (i - 1);
		if (0 <= _y && _y < 20) {

			for (let j = 0; j < 3; j++) {
				// ensure we're not going to access a negative or out of range index
				let _x = x + (j - 1);
				if (0 <= _x && _x < 20) {

					let idStr = `#tile_${_y}_${_x}`;
					neighby = document.querySelector(idStr);
					if (neighby.innerText == 'x') {
						dangerCount++;
					}

				}
			}
		}
	}
	
	return dangerCount;
}

const incrementNeighbors = (x, y) => {
	for (let i = 0; i < 3; i++) {
		// ensure we're not going to access a negative or out of range index
		let _y = y + (i - 1);
		if (0 <= _y && _y < 20) {
			for (let j = 0; j < 3; j++) {
				// ensure we're not going to access a negative or out of range index
				let _x = x + (j - 1);
				if (0 <= _x && _x < 20) {
					let idStr = `#tile_${_y}_${_x}`;
					neighby = document.querySelector(idStr);
					if (neighby.innerText != MINEASCII) {
						let nval = parseInt(neighby.innerText)
						neighby.innerText = nval + 1;
						neighby.style.color = COLORS[nval];
					}
					// this adds an interesting behavior where pressing `reset` while painting
					// will cause a new minefield to generate with all tiles (except 0) revealed
					if (painting) makeVis(neighby);
				}
			}
		}
	}
}

const plant = (x, y) => {
	const tile = document.querySelector(`#tile_${y}_${x}`);
	if (tile.innerText != MINEASCII) {
		tile.innerText = MINEASCII;
		// tile.style.color = 'rgb(0, 0, 0)'
		tile.style.color = 'rgba(0,0,0,0)';
		//tile.style.backgroundColor = MINECOLOR;
		incrementNeighbors(x, y);
		return true;
	}
	return false;
}

const plantMines = async () => {
	for (let m = 0; m < NUMMINES; m++) {
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
	const splitId = tile.id.split('_');
	const y = parseInt(splitId[1]);
	const x = parseInt(splitId[2]);
	for (let i = 0; i < 3; i++) {
		// ensure we're not going to access a negative or out of range index
		let _y = y + (i - 1);
		if (0 <= _y && _y < 20) {
			for (let j = 0; j < 3; j++) {
				// ensure we're not going to access a negative or out of range index
				let _x = x + (j - 1);
				if (0 <= _x && _x < 20) {
					neighby = document.querySelector(`#tile_${_y}_${_x}`);

					// uncomment to disallow cascades from removing flags
					// if (neighby.style.backgroundColor == FLAGCOLOR) continue;

					let isHidden = neighby.style.fontSize == 0 || neighby.style.fontSize == '0' || neighby.style.fontSize == '0em';
					let isZero = neighby.innerText == '0';
					let isLocalTile = neighby == tile;

					makeVis(neighby);

					if (isHidden && isZero && !isLocalTile) {
						neighby.style.color = 'rgba(0,0,0,0)';
						clearNeighbors(neighby);
					}
				}
			}
		}
	}
}

const clickEvent = e => {
	if (GG) return;

	if (painting) {
		const splitId = e.target.id.split('_');
		const y = parseInt(splitId[1]);
		const x = parseInt(splitId[2]);
		return plant(x, y);
	}

	if (e.target.style.backgroundColor == FLAGCOLOR) return;
	
	if (e.target.innerText == MINEASCII) {
		// clicked on a mine
		GG = true;
		sub.innerText = 'you died';
		makeVis(e.target);
		//e.target.style.color = 'rgb(255, 75, 75)';
	} else {
		if (e.target.innerText != '0') {
			e.target.style.color = COLORS[parseInt(e.target.innerText) - 1];
			makeVis(e.target);
		} else {
			clearNeighbors(e.target);
		}
	}
}

const mousein = e => {
	if (GG) return;
	e.target.style.outline = '1px solid grey';
	e.target.style.zIndex = 2;
}

const mouseout = e => {
	e.target.style.outline = '';
	e.target.style.zIndex = 1;
}

const rightclick = e => {
	e.preventDefault();

	let tile = e.target
	let unrevealed = tile.style.backgroundColor == HIDDENCOLOR1 || tile.style.backgroundColor == HIDDENCOLOR2;
	let isFlagged = tile.style.backgroundColor == FLAGCOLOR;

	if (unrevealed) {
		tile.style.backgroundColor = FLAGCOLOR;
	} else if (isFlagged) {
		const splitId = tile.id.split('_');
		const y = parseInt(splitId[1]);
		const x = parseInt(splitId[2]);
		tile.style.backgroundColor = ((y + x) % 2 == 0) ? HIDDENCOLOR1 : HIDDENCOLOR2; 
	}
 
	return false;
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
			tile.style.backgroundColor = ((i + j) % 2 == 0) ? HIDDENCOLOR1 : HIDDENCOLOR2; 
			
			tile.addEventListener('click', clickEvent);
			tile.addEventListener('contextmenu', rightclick);
			tile.addEventListener('mouseenter', mousein);
			tile.addEventListener('mouseleave', mouseout);
			minefield.appendChild(tile);
		}
	}
}

const clearField = () => {
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			const tile = document.querySelector(`#tile_${i}_${j}`);
			tile.innerText = '0';
			makeInvis(tile);
		}
	}
	GG = false;
	sub.innerText = '​';
}

const togglePainting = e => {
	painting = !painting;
	e.target.style.backgroundColor = painting ? 'green' : 'rgb(179, 103, 144)';
}

const clearButton = document.querySelector('.clear');
clearButton.addEventListener('click', clearField);

const resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', () => {
	clearField();
	plantMines();
});

const generateButton = document.querySelector('.generate');
generateButton.addEventListener('click', plantMines);

const paintButton = document.querySelector('.paint');
paintButton.addEventListener('click', togglePainting);


initTiles();
if (!painting) plantMines();
 