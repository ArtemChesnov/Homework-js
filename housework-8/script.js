'use strict';

const basketEl = document.querySelector(".basket");
const productValue = document.querySelector(".cartIcon-value");
const basketTotalEl = document.querySelector(".basket__list-total");
const basketTotalValue = document.querySelector(".total__price");

document.querySelector(".cartIconWrap").addEventListener("click", () => {
    basketEl.classList.toggle("hidden");
});

/**
 * Корзина товаров.
 */
const basket = {};

document.querySelector(".featuredItems").addEventListener("click", (event) => {
    if (!event.target.closest(".addToCart")) {
        return;
    }
    const productEls = event.target.closest(".featuredItem");
    const id = productEls.dataset.id;
    const name = productEls.dataset.name;
    const price = productEls.dataset.price;

    addToCart(id, name, price);

});

/**
 * Функция добавляет товар в корзину.
 * @param {number} id - Id продукта.
 * @param {string} name - Название продукта.
 * @param {number} price - Цена продукта.
 */

function addToCart(id, name, price) {
    if (!(id in basket)) {
        basket[id] = {
            id: id,
            name: name,
            price: price,
            count: 0
        };
    };
    basket[id].count++;

    renderProductInBasket(id);
    productValue.textContent = getTotalCountInBasket();
    basketTotalValue.textContent = getTotalPrice().toFixed(2);
};

/**
 * Считает и возвращает общее количество товаров в корзине.
 * @return {number} - Количество товаров в корзине.
 */

function getTotalCountInBasket() {
    const arr = Object.values(basket);
    let count = 0;
    for (const product of arr) {
        count += product.count;
    };
    return count;
};

/**
 * Считает и возвращает итоговую цену по всем добавленным в корзину товарам.
 * @return {number} - Итоговую цену по всем добавленным товарам.
 */

function getTotalPrice() {
    const arr = Object.values(basket);
    let total = 0;
    for (const product of arr) {
        total += product.price * product.count;
    };
    return total;
};

/**
 * Отрисовывает в корзину количество и общую стоимость добавляемого товара.
 * @param {number} id - id товара.
 */

function renderProductInBasket(id) {
    const basketStrEl = basketEl.querySelector(`.product__list[data-id="${id}"]`);

    if (!basketStrEl) {
        renderNewProductInBasket(id);
        return;
    };
    basketStrEl.querySelector('.product__item-count').textContent = basket[id].count;
    basketStrEl.querySelector('.product__item-total').textContent = (basket[id].price * basket[id].count).toFixed(2);
};

/**
 * Функция отрисовывает добавляемый в корзину товар.
 * @param {number} id - id товара.
 */

function renderNewProductInBasket(id) {
    const productStr = `
    <ul class="product__list" data-id="${id}">
    <li class="product__item product__item-name">${basket[id].name}</li> 
    <li class = "product__item product__item-btns"><button class="btn-countMin">&#8722;</button><span class="product__item-count">${basket[id].count}</span><button class="btn-countPl">&#43;</button></li> 
    <li class="product__item">$<span class="product__item-price">${basket[id].price}</span></li>
    <li class="product__item">$<span class="product__item-total">${(basket[id].price * basket[id].count).toFixed(2)}</span></li>
    <li class="product__item"><button class="delete-btn">&#215;</button></li>
    </ul>
    `
    basketTotalEl.insertAdjacentHTML("beforebegin", productStr);


    /**
     * Обработчик клика на кнопки "-"(уменьшить кол-во товара на ед.), 
     * "+"(увеличить на ед.) и "х"(удалить товар из корзины).
     */
    const basketStrEl = document.querySelector(`.product__list[data-id="${id}"]`);
    basketStrEl.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-countMin')) {
            basket[id].count--;
        };

        if (event.target.classList.contains('btn-countPl')) {
            basket[id].count++;
        };

        if (basket[id].count < 1) {
            basketStrEl.remove();
        }
        if (event.target.classList.contains('delete-btn')) {
            basket[id].count = 0;
            basketStrEl.remove();
        };
        basketStrEl.querySelector('.product__item-count').textContent = basket[id].count;
        basketStrEl.querySelector('.product__item-total').textContent = (basket[id].price * basket[id].count).toFixed(2);
        productValue.textContent = getTotalCountInBasket();
        basketTotalValue.textContent = getTotalPrice().toFixed(2);
    });
};