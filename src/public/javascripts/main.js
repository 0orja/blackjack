// main.js
document.addEventListener('DOMContentLoaded', main);

function main() {
	console.log('main');
	const playBtn = document.querySelector('.playBtn');
	console.log(playBtn);
	playBtn.addEventListener('click', function(evt) {
		const startPage = document.querySelector('.start');
		startPage.classList.toggle('hide');
		evt.preventDefault();
	})
}