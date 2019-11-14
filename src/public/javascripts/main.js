// main.js
document.addEventListener('DOMContentLoaded', main);

function main() {
	//console.log('main');
	const playBtn = document.querySelector('.playBtn');
	playBtn.addEventListener('click', function(evt) {
		const startPage = document.querySelector('.start');
		startPage.classList.toggle('hide');
		const startVals = document.querySelector('#startValues').value.split(',');
	
		//console.log('start values', startValues);
		startGame(startVals);

		evt.preventDefault();
	});

}

function startGame(starting) {
//	console.log('start values', starting);
	const game = document.querySelector('.game');
	const suits = ['spades', 'hearts', 'clubs', 'diamonds'];
	const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
	const deck = [];
	// default starting cards are spades
	for (const s of suits) {
		for (const v of values) {
			const card = {value: v, suit: s};
			const check = card.value+'';
			if (starting.includes(check) || card.suit != 'spades') {
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
	
	if (starting.length > 0) {
		console.log('moving to top of deck');
		starting = starting.reverse();
		for (const val of starting) {
			if (val === 'A' || val === 'J' || val === 'Q' || val === 'K') {
				deck.unshift({value: val, suit: 'spades'});
			}
			else {
				deck.unshift({value: parseInt(val), suit: 'spades'});

			}
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

	const stand = document.createElement('input');
	stand.setAttribute('type', 'submit');
	stand.setAttribute('value', 'Stand');

	hit.addEventListener('click', function(evt) {
		newCard = deck.shift();
		player.push(newCard);
		showCard = deal(newCard);
		document.querySelector('.playerCard').appendChild(showCard);

		playerHeading.innerHTML = 'Your Hand: Total = ' + calcTotal(player);
		if (calcTotal(player) > 21) {
			// bust
			hit.classList.toggle('hide');
			stand.classList.toggle('hide');
			const bust = document.createElement('div');
			bust.className = 'bust'
			bust.innerHTML = 'Player lost 😩';
			game.appendChild(bust);
		}		
		evt.preventDefault();

	});
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
		else if (typeof(curr.value) === 'number') {
			return total += curr.value;
		}
		else if (curr.value === 'A') {
			aces += 1; 
			return total;
		}
	}, 0);
	for (let a = 0; a<aces; a++) { // wait until end to add ace value
		if (total + 11 > 21) {
			total += 1;
		}
		else {
			total += 11;
		}
	}
	return total;
}