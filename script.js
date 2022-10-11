const HEIGHT = 20;
const WIDTH = 20;

const minefield = document.querySelector('.minefield');
const sub = document.querySelector('.sub')

const COLOR1 = '#dcd6d6';
const COLOR2 = '#cbc0c8';

const countNeighbors = tile => {
	const splitId = tile.id.split('_')
	const x = parseInt(splitId[1]);
	const y = parseInt(splitId[2]);

	let neighbors = 0;

	for (let i = 0; i < 3; i++) {
		let _y = y + (i - 1);
		if (0 <= _y && _y <= 20) {
			for (let j = 0; j < 3; j++) {
				let _x = x + (j - 1);
				if (0 <= _x && _x <= 20) {
					let idStr = `#tile_${_y}_${_x}`;
					console.log(idStr);
					neighby = document.querySelector(idStr);
					if (neighby.innerText == 'o') {
						neighbors++;
					}
				}
			}
		}
	}
	
	return neighbors;
}

for (let i = 0; i < HEIGHT; i++) {
	for (let j = 0; j < WIDTH; j++) {
		const tile = document.createElement('div');
		//tile.innerText = `${i}`;
		tile.innerText = Math.random() < 0.1 ? 'o' : '';
		tile.style.backgroundColor = ((i + j) % 2 == 0) ? COLOR1 : COLOR2; 
		tile.classList.add('tile');
		tile.id = `tile_${i}_${j}`;
		minefield.appendChild(tile);

		tile.addEventListener('click', e => {
			if (e.target.innerText == 'o') {
				sub.innerText = 'you died';
			} else {
				e.target.innerText = countNeighbors(e.target);
				e.target.style.color = 'rgba(115, 6, 6, 0.846)';
			}
		})
	}
}