// ==UserScript==
// @name         CardMarket QOL v0
// @namespace    http://tampermonkey.net/
// @version      2025-05-13
// @description  try to take over the world!
// @author       Balzar
// @include https://www.cardmarket.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        none
// ==/UserScript==

let cardsInCart = JSON.parse(window.localStorage.getItem('cardmarket-qol_cards-in-cart'));

function displayCardListInCart() {
    'use strict';

    window.localStorage.setItem('cardmarket-qol_cards-in-cart', JSON.stringify([]));

    const [rightColumn] = document.getElementsByClassName('col-12 col-lg-3 order-first order-lg-0');

    if (!rightColumn) return;

    const ul = rightColumn.appendChild(document.createElement("section")).appendChild(document.createElement("ul"));
    const listHeader = ul.appendChild(document.createElement("li"));
    listHeader.textContent = 'Cards in cart:'
    const cardLines = Array.from(document.querySelectorAll('tbody tr'));

    for (const card of cardLines) {
        const cardAmount = card.getAttribute('data-amount');
        const cardName = card.getAttribute('data-name');
        const li = ul.appendChild(document.createElement("li"));
        li.textContent = `x${cardAmount} ${cardName}`;
        cardsInCart.push({name: cardName, amount: cardAmount})
    }

    window.localStorage.setItem('cardmarket-qol_cards-in-cart', JSON.stringify(cardsInCart));
}

function retrieveCardListInWants() {
    const cardLines = Array.from(document.querySelectorAll('tbody tr'));
    const cards = [];
    const filteredCardLines = cardLines.filter(cl => {
      const [pictureLine, amountLine, nameLine] = Array.from(cl.children).slice(1, 4);

      if (!amountLine || !nameLine) return false;

      const [nameLineLink] = Array.from(nameLine.children);
      const amount = amountLine.innerText;
      const name = nameLineLink.innerText;
      const card = {amount, name};

      cards.push(card);
      const cartLine = cl.insertBefore(document.createElement("td"), pictureLine);
      cartLine.innerText = cardsInCart.some(c => c.name === card.name && c.amount >= card.amount) ? "✅" : "❌";
      cartLine.setAttribute("class", "cart min-size d-none d-sm-table-cell p-2");

      return true;
    })

    const [tableHeader] = Array.from(document.querySelectorAll('thead tr'));

    const inCartHeader = tableHeader.insertBefore(document.createElement("th"),Array.from(tableHeader.children)[1]);
    inCartHeader.innerText = 'In cart';

}

function urlIncludes(string) {
    return window.location.href.includes(string)
}

function wait(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

(function() {
    'use strict';
    console.log('--- Executing CardMarket QOL v0 ---');

    if (urlIncludes('ShoppingCart')) {
        displayCardListInCart()
    }

    if (urlIncludes('Wants')) {
        retrieveCardListInWants()
    }
})();
