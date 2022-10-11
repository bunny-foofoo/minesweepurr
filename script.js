const HEIGHT = 20;
const WIDTH = 20;

const minefield = document.querySelector('.minefield');

const COLOR1 = '#dcd6d6';
const COLOR2 = '#cbc0c8';

for (let i = 0; i < HEIGHT; i++) {
	for (let j = 0; j < WIDTH; j++) {
		const tile = document.createElement('div');
		//tile.innerText = `${i}`;
		tile.style.backgroundColor = ((i + j) % 2 == 0) ? COLOR1 : COLOR2; 
		tile.classList.add('tile');
		tile.id = `tile_${i}_${j}`;
		minefield.appendChild(tile);
	}
}