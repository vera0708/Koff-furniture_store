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

    mount(parent) {
        const title = this.getOrderTitle();
        const info = this.getOrderInfo();
        const returnLink = this.getReturnLink();

        this.containerElement.append(title, info, returnLink);

        if (this.isMounted) {
            return;
        }

        parent.append(this.element);
        this.isMounted = true;
    }

    unmount() {
        this.element.remove();
        this.isMounted = false;
    };

    getOrderTitle() {
        const title = document.createElement('div');
        title.classList.add('order__title');
        const titleText = document.createElement('h2');
        titleText.classList.add('order__title-text');
        titleText.textContent = 'Заказ успешно размещен';
        const orderPrice = document.createElement('p');
        orderPrice.classList.add('order__title-price');
        orderPrice.textContent = '20 000 ₽';
        title.append(titleText, orderPrice);
        return title;
    };

    getOrderInfo() {
        const orderLink = document.createElement('a');
        orderLink.classList.add('order__link');
        orderLink.href = '/order';
        const orderNumber = document.createElement('p');
        orderNumber.classList.add('order__title-number');
        orderNumber.textContent = '№43435';
        orderLink.append(orderNumber);

        orderLink.insertAdjacentHTML('beforeend', `
        <div class="order__characters">
          <h3 class="order__characteristics-title">Данные доставки</h3>
          <table class="order__characteristics-table order-table">
            <tr class="order-table__row">
              <td class="order-table__field">Получатель</td>
              <td class="order-table__value">Иванов Петр Александрович</td>
            </tr>
            <tr class="order-table__row">
              <td class="order-table__field">Телефон</td>
              <td class="order-table__value">+7 (737) 346 23 00</td>
            </tr>
            <tr class="order-table__row">
              <td class="order-table__field">E-mail</td>
              <td class="order-table__value">Ivanov84@gmail.com</td>
            </tr>
            <tr class="order-table__row">
              <td class="order-table__field">Адрес доставки</td>
              <td class="order-table__value">Москва, ул. Ленина, 21, кв.33</td>
            </tr>
            <tr class="order-table__row">
              <td class="order-table__field">Способ оплаты</td>
              <td class="order-table__value">Картой при получении</td>
            </tr>
            <tr class="order-table__row">
              <td class="order-table__field">Способ получения</td>
              <td class="order-table__value">Доставка</td>
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