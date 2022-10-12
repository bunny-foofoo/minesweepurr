const HEIGHT = 20;
const WIDTH = 20;

const minefield = document.querySelector('.minefield');
const sub = document.querySelector('.sub')

const COLOR1 = '#dcd6d6';
const COLOR2 = '#cbc0c8';

const MINEASCII = 'ϴ';

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
const PLANTSPEED = 75;
const NUMMINES = 60;

let painting = true;

const makeVis = tile => {
	tile.style.fontSize = '1em';
}

const makeInvis = tile => {
	tile.style.fontSize = '0';
}

const countNeighbors = tile => {
	const splitId = tile.id.split('_')
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
		tile.style.color = 'rgb(0, 0, 0)'
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
			await new Promise(r => setTimeout(r, PLANTSPEED));
		} else {
			m--;
		}
	}
}

const clickEvent = e => {
	if (GG) return;

	if (painting) {
		const splitId = e.target.id.split('_')
		const y = parseInt(splitId[1]);
		const x = parseInt(splitId[2]);
		return plant(x, y);
	}
	
	if (e.target.innerText == MINEASCII) {
		// clicked on a mine
		GG = true;
		sub.innerText = 'you died';
		e.target.style.color = 'rgb(255, 75, 75)';
	} else {
		e.target.style.color = COLORS[parseInt(e.target.innerText) - 1];
		makeVis(e.target);
	}
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
			tile.style.backgroundColor = ((i + j) % 2 == 0) ? COLOR1 : COLOR2; 
			
			tile.addEventListener('click', clickEvent);
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

const resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', clearField);

const generateButton = document.querySelector('.generate');
generateButton.addEventListener('click', plantMines)

initTiles();
if (!painting) plantMines();
 