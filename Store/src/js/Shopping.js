export default class Shopping{
  orders = new Map();
  quantity = 0;
  totalPrice = 0;

  constructor() {
  }

  add(product) {
    this.quantity++;
    this.totalPrice += product.price;

    if (this.orders.has(product.id)) {
      const newOrder = this.orders.get(product.id);
      newOrder.count++;
      this.orders.set(product.id, newOrder);
    } else {
      this.orders.set(product.id, {
        'name': product.title,
        'price': product.price,
        'count': 1
      })
    }
  }

  remove (product) {
    const deletedCount = this.orders.get(product.id).count;
    const deletedPrice = product.price * deletedCount;
    this.orders.delete(product.id);
    this.totalPrice -= deletedPrice;
    this.deletedCount -= deletedCount;
  }

  showOrders() {
    const ordersEle = document.getElementById('orders');
    const totalQuantity = document.getElementById('shopping_total_quantity');
    const totalPrice = document.getElementById('shopping_total_price');

    ordersEle.innerHTML = '';

    for(let order of this.orders.values()  ) {
      let html = `
        <div class='p-2 border-red-100 border rounded-md m-2'>${order.name} (${order.price}) (${order.count})</div>
      `
      ordersEle.insertAdjacentHTML('beforeend', html);
    }

    totalQuantity.textContent = this.quantity;
    totalPrice.textContent = this.totalPrice;
  }
}