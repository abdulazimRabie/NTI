type Product = {
  id: number,
  title: string,
  price: number,
  category: string,
  description: string,
  image: string,
  rating: {
    rate: number,
    count: number
  }  
}

export class Products{
  static page = 1;
  public productsList : Product[] = [];
  public filterdProductsList : Product[] = [];
  public filters : {
    searchName: string, 
    category: string, 
    minPrice: number, 
    maxPrice: number} 
    = {
      searchName: "",
      category: "",
      minPrice: 0,
      maxPrice: 0
  }


  constructor() {}

  async getData() {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      
      if (!response.ok) {
        throw new Error(`Can\'t show products. Status is ${response.status}`)
      }
      
      const data: Product[] = await response.json();
      console.log(data);
      this.productsList = data;
      this.filterdProductsList = data;
    }
    catch (error) {
      console.log(error);
    }
  }
  
  showProdcuts(pageNumber: number) {
    const container = document.querySelector('#productsWrapper')!;
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
  }

  getCategories() {
    const categories = new Set<string>();

    this.productsList.forEach(product => {
      categories.add(product.category);
    });

    this.showCategories([...categories]);
  }

  private showCategories(categories: string[]) {
    const categoriesSelect = document.getElementById('categories')!;

    categories.forEach((category : string) => {
      categoriesSelect.insertAdjacentHTML('beforeend', `<option>${category}</option>`)
    })
  }

  private searchOnProdcut() {
    if (this.filters.searchName) {
      this.filterdProductsList = this.productsList.filter((product) => {
        const searchVal = this.filters.searchName.toLowerCase();
        const productTitle = product.title.toLowerCase();
        return productTitle.includes(searchVal);
      })
    }
  }

  private filterProductsByCategory() {
    if (this.filters.category) {
      this.filterdProductsList = this.filterdProductsList.filter((product) => {
        const categoryVal = this.filters.category.toLowerCase();
        const productCategory = product.category.toLowerCase();
        return productCategory.includes(categoryVal);
      })
    }
  }

  private filterProductsByMinMaxPrice() {
    if (this.filters.minPrice || this.filters.maxPrice) {
      const minPrice = this.filters.minPrice || 0;
      const maxPrice = this.filters.maxPrice || Number.MAX_SAFE_INTEGER;

      this.filterdProductsList = this.filterdProductsList.filter((product) => {
        return (product.price >= minPrice && product.price <= maxPrice);
      })
    }
  }

  sortProductByPrice(type: string) {
    this.filterdProductsList.sort(function(a, b) {
      // from highest to lowest
      return b.price - a.price
    })

    if (type.toLowerCase() == 'lowest') this.filterdProductsList = this.filterdProductsList.reverse();

    Products.page = 1;
    this.showProdcuts(Products.page)
  }

  applyFilter() {
    this.filterdProductsList = this.productsList;
    
    this.searchOnProdcut()
    this.filterProductsByCategory();
    this.filterProductsByMinMaxPrice();
    
    Products.page = 1;
    this.showProdcuts(Products.page)
    this.activePagenation();
  }

  activePagenation() {
    const numberOfPages = this.filterdProductsList.length <= 4 ? 1 : Math.ceil(this.filterdProductsList.length / 4);
    const pagesEle = document.getElementById('pages')!;
    pagesEle.innerHTML = '';

    for(let i = 1; i <= numberOfPages; i++) {
      pagesEle.insertAdjacentHTML('beforeend', `<button class="join-item btn">${i}</button>`);
    }
  }

}