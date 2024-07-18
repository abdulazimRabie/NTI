export default class Products{
  static page = 1;
  productsList = [];
  filterdProductsList = [];
  filters = {
      searchName: null,
      category: null,
      minPrice: null,
      maxPrice: null
  }

  constructor() {}

  async getData() {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      
      if (!response.ok) {
        throw new Error(`Can\'t show products. Status is ${response.status}`)
      }
      
      const data = await response.json();
      this.productsList = data;
      this.filterdProductsList = data;
      console.log(data);
    }
    catch (error) {
      console.log(error);
    }
  }
  
  showProdcuts(pageNumber) {
    const container = document.querySelector('#productsWrapper');
    container.innerHTML = ``;

    const end = pageNumber * 5;
    const start = end - 5;

    for(let i = start; i < end && i < this.filterdProductsList.length; i++) {
      const product = this.filterdProductsList[i];

      let html = `
      <div class="card bg-base-100 w-96 shadow-xl">
        <figure class="px-10 pt-10">
          <img src="${product.image}" alt="${product.title}" class="rounded-md h-40"/>
        </figure>
        <div class="card-body">
          <h2 class="card-title">${product.title}</h2>
          <p>$${product.price}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary addToCard" data-id="${product.id}">Add to card</button>
          </div>
        </div>
      </div>
      `;

      container.insertAdjacentHTML('beforeend', html);
    }

    console.log(`iam showing products from page ${pageNumber}`);
  }

  getCategories() {
    const categories = new Set();

    this.productsList.forEach(product => {
      categories.add(product.category);
    });

    this.#showCategories([...categories]);
  }

  #showCategories(categories) {
    const categoriesSelect = document.getElementById('categories');

    categories.forEach(category => {
      categoriesSelect.insertAdjacentHTML('beforeend', `<option>${category}</option>`)
    })
  }

  #searchOnProdcut() {
    if (this.filters.searchName) {
      this.filterdProductsList = this.productsList.filter((product) => {
        const searchVal = this.filters.searchName.toLowerCase();
        const productTitle = product.title.toLowerCase();
        return productTitle.includes(searchVal);
      })
    }
  }

  #filterProductsByCategory() {
    if (this.filters.category) {
      this.filterdProductsList = this.filterdProductsList.filter((product) => {
        const categoryVal = this.filters.category.toLowerCase();
        const productCategory = product.category.toLowerCase();
        return productCategory.includes(categoryVal);
      })
    }
  }

  #filterProductsByMinMaxPrice() {
    if (this.filters.minPrice || this.filters.maxPrice) {
      const minPrice = this.filters.minPrice || 0;
      const maxPrice = this.filters.maxPrice || Number.MAX_SAFE_INTEGER;

      this.filterdProductsList = this.filterdProductsList.filter((product) => {
        return (product.price >= minPrice && product.price <= maxPrice);
      })
    }
  }

  sortProductByPrice(type) {
    this.filterdProductsList.sort(function(a, b) {
      // from highest to lowest
      return b.price - a.price
    })

    if (type.toLowerCase() == 'lowest') this.productsLfilterdProductsListist = this.filterdProductsList.reverse();

    Products.page = 1;
    this.showProdcuts(Products.page)
  }

  applyFilter() {
    
    console.log(this.filters);

    this.filterdProductsList = this.productsList;
    
    this.#searchOnProdcut()
    this.#filterProductsByCategory();
    this.#filterProductsByMinMaxPrice();
    
    Products.page = 1;
    this.showProdcuts(Products.page)
    this.activePagenation();
  }

  activePagenation() {
    const numberOfPages = this.filterdProductsList.length <= 4 ? 1 : Math.ceil(this.filterdProductsList.length / 4);
    const pagesEle = document.getElementById('pages');
    console.log('pages now must be', numberOfPages);
    pagesEle.innerHTML = '';

    for(let i = 1; i <= numberOfPages; i++) {
      pagesEle.insertAdjacentHTML('beforeend', `<button class="join-item btn">${i}</button>`);
    }
  }

}