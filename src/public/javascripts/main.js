// main.js
document.addEventListener('DOMContentLoaded', main);
console.log('hi');

function main() {
	console.log('main');
	const playBtn = document.querySelector('.playBtn');
	//console.log(playBtn);
	playBtn.addEventListener('click', function(evt) {
		const startPage = document.querySelector('.start');
		startPage.classList.toggle('hide');
		const startValues = document.querySelector('#startValues').value.split(',').map(x => parseInt(x));
	
		//console.log('start values', startValues);
		startGame(startValues);

		evt.preventDefault();
	});

}

function startGame(starting) {
	console.log('start values', starting);
	const game = document.querySelector('.game');
	const suits = ['spades', 'hearts', 'clubs', 'diamonds'];
	const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
	const deck = [];
	// default starting cards are spades
	for (const s of suits) {
		for (const v of values) {
			const card = {value: v, suit: s};
			if (starting.includes(card.value) || card.suit != 'spades') {
				deck.push(card);
			}
		}
		//deck.forEach((ele) => console.log(ele.suit, ele.value));
	}
	//console.log(deck);
	// shuffle algorithm referred to https://www.thatsoftwaredude.com/content/6196/coding-a-card-deck-in-javascript
	for (let i = 0; i < 1000; i++) {
		const loc1 = Math.floor(Math.random() * deck.length);
		const loc2 = Math.floor(Math.random() * deck.length);
		const temp = deck[loc1];
		deck[loc1] = deck[loc2];
		deck[loc2] = temp;
	}
	
	if (startValues.length > 0) {
		//console.log('moving to top of deck');
		startValues = startValues.reverse();
		for (const val of startValues) {
			deck.unshift({value: val, suit: 'spades'});
		}
	}
	const computer = [];
	let computerTotal = 0;
	const player = [];
	let playerTotal = 0;
	// deal
	for (let round = 0; round < 2; round++) {
		computer.push(deck.shift());
		player.push(deck.shift());
	}
	computerTotal = calcTotal(computer);
	playerTotal = calcTotal(player);
	console.log(computerTotal, playerTotal);

	const computerHeading = document.createElement('h2');
	computerHeading.innerHTML = 'Computer Hand: Total = ?'
	game.appendChild(computerHeading);

	const computerCards = createCardDiv(computer);
	computerCards.classList.add('faceDown');
	computerCards.classList.add('computerCard');
	game.appendChild(computerCards);

	const playerHeading = document.createElement('h2');
	playerHeading.innerHTML = 'Your Hand: Total = ' + playerTotal;
	game.appendChild(playerHeading);

	const playerCards = createCardDiv(player);
	playerCards.classList.add('playerCard');
	game.appendChild(playerCards);

	// hit or stand
	const hit = document.createElement('input');
	hit.setAttribute('type', 'submit');
	hit.setAttribute('value', 'Hit');
	hit.addEventListener('click', function(evt) {
		newCard = deck.shift();
		player.push(newCard);
		showCard = deal(newCard);
		document.querySelector('.playerCard').appendChild(showCard);
		if (calcTotal(player) > 21) {
			// bus
		}
		playerHeading.innerHTML = 'Your Hand: Total = ' + calcTotal(player);
		evt.preventDefault();

	});
	const stand = document.createElement('input');
	stand.setAttribute('type', 'submit');

	stand.setAttribute('value', 'Stand');
	game.appendChild(hit);
	game.appendChild(stand);


}

function createCardDiv(cardArray) {
	const elem = document.createElement('div');
	for (const c of cardArray) {
		const card = deal(c);
		elem.appendChild(card);
	}
	return elem;
}

function deal(card) {
	console.log(card.value, card.suit);
	const showCard = document.createElement('div');
	showCard.className = 'dealt';
	let icon;
	if (card.suit == 'spades') icon = '♠';
	else if (card.suit == 'hearts') icon = '♥';
	else if (card.suit == 'clubs') icon = '♣';
	else if (card.suit == 'diamonds') icon = '♦';
	const suitDisplay = document.createElement('div');
	suitDisplay.className = 'suit';
	suitDisplay.innerHTML = icon;
	const valDisplay = document.createElement('div');
	valDisplay.className = 'val';
	valDisplay.textContent = card.value;
	showCard.appendChild(valDisplay);
	showCard.appendChild(suitDisplay);
	return showCard;
}
function calcTotal(cardArray) {
	let aces = 0;
	let total = cardArray.reduce(function(total, curr){
		if (curr.value === 'J' || curr.value == 'Q' || curr.value == 'K') {
			return total += 10;
		}
		else if (typeof(curr.value === 'number')) {
			return total += curr.value;
		}
		else if (curr.value === 'A') {
			aces += 1; 
		}
	}, 0);
	for (let a = 0; a<aces; a++) {
		if (total + 11 > 21) {
			total += 1;
		}
		else {
			total += 11;
		}
	}
	return total;
}