console.log('hi from typescript');
import  {Products} from './Products.js';
import {Shopping} from "./Shopping.js";

const products = new Products();
const orders = new Shopping();

function activePagenation() {
  const pagesEle = document.getElementById('pages') as HTMLElement;
  pagesEle.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const pageNumber =  target.textContent;
    if (pageNumber) {
      Products.page = +pageNumber;
      products.showProdcuts(+pageNumber);
    }
    addOrder();
  })
}

function init() {
  products.getData()
    .then(_ => products.showProdcuts(Products.page))
    .then(_ => products.activePagenation())
    .then(_ => products.getCategories())
    .then(_ => activePagenation())
    .then(_ => applyFilter())
    .then(_ => addOrder())
    .then(_ => sortProductByPrice())
}

function filterActions() {
  searchAction();
  categoryAction();
  minPriceAction();
  maxPriceAction();
}

function applyFilter() {
  const applyBtn = document.getElementById('applyFilter') as HTMLButtonElement;
  applyBtn.onclick = function () {
    products.applyFilter();
    addOrder();
  }
}

function searchAction() {
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  searchInput.onkeyup = function () {
    products.filters.searchName = searchInput.value;
  }
}

function minPriceAction() {
  const minPriceInput = document.getElementById('minPrice') as HTMLInputElement;
  minPriceInput.onchange = function () {
    products.filters.minPrice = +minPriceInput.value;
  }
}

function maxPriceAction() {
  const maxPriceInput = document.getElementById('maxPrice') as HTMLInputElement;
  maxPriceInput.onchange = function () {
    products.filters.maxPrice = +maxPriceInput.value;
  }
}

function categoryAction() {
  const categorySelect = document.getElementById('categories') as HTMLInputElement;
  categorySelect.onchange = function () {
    products.filters.category = categorySelect.value;
  }
}

function sortProductByPrice() {
  const sortSelect = document.getElementById('sortPrice') as HTMLInputElement;
  sortSelect.onchange = function () {
    products.sortProductByPrice(sortSelect.value);
    addOrder();
  }
}

function addOrder() {
  const addOrderBtns = document.querySelectorAll('.addToCard') as NodeListOf<HTMLElement>;
  addOrderBtns.forEach(button => {
    button.onclick = function () {
      const id = button.getAttribute('data-id')!;
      const clickedOrder = products.productsList.find((e) => {
        return e.id == +id;
      })
      if (clickedOrder) 
        orders.add(clickedOrder);
      orders.showOrders();
    }
  })
}

init();
filterActions();
