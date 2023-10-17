import { addContainer } from "../addContainer";

export class Order {
  static instance = null;

  constructor() {
    if (!Order.instance) {
      Order.instance = this;
      this.element = document.createElement('section');
      this.element.classList.add('order');
      this.containerElement = addContainer(this.element);
      this.isMounted = false;
    }
    return Order.instance;
  }

  mount(parent, data) {
    if (this.isMounted) {
      return;
    };

    const title = this.getOrderTitle(data);
    const info = this.getOrderInfo(data);
    const returnLink = this.getReturnLink();

    this.containerElement.append(title, info, returnLink);

    parent.append(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  };

  getOrderTitle(data) {
    const title = document.createElement('div');
    title.classList.add('order__title');
    const titleText = document.createElement('h2');
    titleText.classList.add('order__title-text');
    titleText.textContent = 'Заказ успешно размещен';
    const orderPrice = document.createElement('p');
    orderPrice.classList.add('order__title-price');
    orderPrice.innerHTML = `${(+data.totalPrice).toLocaleString()}&nbsp;₽`;
    title.append(titleText, orderPrice);
    return title;
  };

  getOrderInfo(data) {
    const orderLink = document.createElement('a');
    orderLink.classList.add('order__link');
    orderLink.href = '/order';
    const orderNumber = document.createElement('p');
    orderNumber.classList.add('order__title-number');
    orderNumber.textContent = `№ ${data.id}`;
    orderLink.append(orderNumber);

    orderLink.insertAdjacentHTML('beforeend', `
        <div class="order__characters">
          <h3 class="order__characteristics-title">Данные доставки</h3>
          <table class="order__characteristics-table order-table">
            <tr class="order-table__row">
              <td class="order-table__field">Получатель</td>
              <td class="order-table__value">${data.name}</td>
            </tr>
            <tr class="order-table__row">
              <td class="order-table__field">Телефон</td>
              <td class="order-table__value">${data.phone}</td>
            </tr>
            <tr class="order-table__row">
              <td class="order-table__field">E-mail</td>
              <td class="order-table__value">${data.email}</td>
            </tr>
            <tr class="order-table__row">
              <td class="order-table__field">Адрес доставки</td>
              <td class="order-table__value">${data.address}</td>
            </tr>
            <tr class="order-table__row">
              <td class="order-table__field">Способ оплаты</td>
              <td class="order-table__value">${data.paymentType}</td>
            </tr>
            <tr class="order-table__row">
              <td class="order-table__field">Способ получения</td>
              <td class="order-table__value">${data.deliveryType}</td>
            </tr>
          </table>
        </div>
        `);
    return orderLink;
  };

  getReturnLink() {
    const returnLink = document.createElement('a');
    returnLink.classList.add('order__btn');
    returnLink.href = '/';
    returnLink.textContent = 'На главную';
    return returnLink;
  };
};