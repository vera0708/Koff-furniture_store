import { API_URL } from "../../const";
import { debounce } from "../../helper";
import { ApiService } from "../../services/ApiService";
import { addContainer } from "../addContainer";

export class Cart {
    static instance = null;

    constructor() {
        if (!Cart.instance) {
            Cart.instance = this;
            this.element = document.createElement('section');
            this.element.classList.add('cart');
            this.containerElement = addContainer(this.element, 'cart__container');
            this.isMounted = false;
            this.debUpdataCart = debounce(this.updateCart.bind(this), 300);
        }
        return Cart.instance;
    };

    async mount(parent, data, emptyText) {
        if (this.isMounted) {
            return;
        };
        this.containerElement.textContent = '';

        const title = document.createElement('h2');
        title.classList.add("cart__title");
        title.textContent = 'Корзина';

        this.containerElement.append(title);

        this.cartData = data;

        if (data.products && data.products.length) {
            this.renderProducts();
            this.renderPlace();
            this.renderForm();
        } else {
            this.containerElement.insertAdjacentHTML('beforeend', `
      <p class="cart__empty"
      style="font-size: 38px;
      text-align: center;
      color: #de5675;
      margin-bottom: 25px;"
      >${emptyText
                || 'Произошла ошибка, попробуйте снова'
                }</p>`)
        };
        parent.prepend(this.element);
        this.isMounted = true;
    }

    unmount() {
        this.element.remove();
        this.isMounted = false;
    };

    updateCart(id, quantity) {
        if (quantity === 0) {
            new ApiService().deleteProductFromCart(id);
            this.cartData.products = this.cartData.products.filter(
                item => item.id !== id
            );
        } else {
            new ApiService().updateQuantityProductToCart(id, quantity);
            this.cartData.products.forEach(item => {
                if (item.id === id) {
                    item.quantity = quantity;
                }
            });
        };

        this.cartData.totalPrice = this.cartData.products.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
        );

        this.placeCount.innerHTML = `${this.cartData.totalCount} товара на сумму:`;
        this.placePrice.innerHTML = `${this.cartData.totalPrice.toLocaleString()}&nbsp;₽`;
    };

    renderProducts() {
        const listProducts = this.cartData.products;
        const listElem = document.createElement('ul');
        listElem.classList.add('cart__products');

        const listItems = listProducts.map(item => {
            const listItemElem = document.createElement('li');
            listItemElem.classList.add('cart__product');
            const img = document.createElement('img');
            img.classList.add('cart__img');
            img.src = `${API_URL}${item.images[0]}`;
            img.alt = item.name;

            const title = document.createElement('h3');
            title.classList.add('cart__title-product');
            title.textContent = item.name;

            const price = document.createElement('p');
            price.classList.add('cart__price');
            price.innerHTML = `${(item.price * item.quantity)
                .toLocaleString()}&nbsp;₽`;
            const article = document.createElement('p');
            article.classList.add('cart__article');
            article.innerHTML = `арт. ${item.article}`;

            const productControl = document.createElement('div');
            productControl.classList.add('cart__product-control');

            const cartProductBtnMinus = document.createElement('button');
            cartProductBtnMinus.classList.add('cart__product-btn');
            cartProductBtnMinus.textContent = '-';

            const cartProductCount = document.createElement('p');
            cartProductCount.classList.add('cart__product-count');
            cartProductCount.textContent = item.quantity;

            const cartProductBtnPlus = document.createElement('button');
            cartProductBtnPlus.classList.add('cart__product-btn');
            cartProductBtnPlus.textContent = '+';

            productControl.append(cartProductBtnMinus, cartProductCount, cartProductBtnPlus);

            cartProductBtnMinus.addEventListener('click', async () => {
                if (item.quantity) {
                    item.quantity--;
                    cartProductCount.textContent = item.quantity;

                    if (item.quantity === 0) {
                        listItemElem.remove();
                        this.debUpdataCart(item.id, item.quantity);
                        return;
                    };

                    price.innerHTML = `${(item.price * item.quantity)
                        .toLocaleString()}&nbsp;₽`;

                    this.debUpdataCart(item.id, item.quantity);
                }
            });

            cartProductBtnPlus.addEventListener('click', () => {
                item.quantity++;
                cartProductCount.textContent = item.quantity;
                price.innerHTML = `${(item.price * item.quantity)
                    .toLocaleString()}&nbsp;₽`;

                this.debUpdataCart(item.id, item.quantity);
            });

            listItemElem.append(img, title, price, article, productControl);

            return listItemElem;
        });
        listElem.append(...listItems);
        this.containerElement.append(listElem);

    };
    renderPlace() {
        const count = this.cartData.products.length;
        const totalPrice = this.cartData.totalPrice;

        const cartPlace = document.createElement('div');
        cartPlace.classList.add('cart__place');

        const cartPlaceTitle = document.createElement('h3');
        cartPlaceTitle.classList.add('cart__subtitle');
        cartPlaceTitle.textContent = 'Оформление';

        const cartPlaceInfo = document.createElement('div');
        cartPlaceInfo.classList.add('cart__place-info');

        this.placeCount = document.createElement('p');
        this.placeCount.classList.add('cart__place-count');
        this.placeCount.innerHTML = `${count} товара на сумму:`;

        this.placePrice = document.createElement('p');
        this.placePrice.classList.add('cart__place-price');
        this.placePrice.innerHTML = `${totalPrice.toLocaleString()}&nbsp;₽`;

        cartPlaceInfo.append(this.placeCount, this.placePrice);

        const cartPlaceDelivery = document.createElement('p');
        cartPlaceDelivery.classList.add('cart__place-delivery');
        cartPlaceDelivery.textContent = 'Доставка 0 ₽';
        // cartPlaceDelivery.innerHTML = `Доставка ${totalPrice.toLocaleString()}&nbsp;₽`;

        const cartPlaceBtn = document.createElement('button');
        cartPlaceBtn.classList.add('cart__place-btn');
        cartPlaceBtn.textContent = 'Оформить заказ';
        cartPlaceBtn.type = 'submit';
        cartPlaceBtn.setAttribute('form', 'order');

        cartPlace.append(cartPlaceTitle, cartPlaceInfo, cartPlaceDelivery, cartPlaceBtn);
        this.containerElement.append(cartPlace);
    };

    renderForm() {
        const form = document.createElement('form');
        form.classList.add('cart__form', 'form-order');
        form.id = 'order';
        form.method = 'POST';

        const title = document.createElement('h3');
        title.classList.add('cart__subtitle', 'cart__subtitle_form-order');
        title.textContent = 'Данные для доставки';

        form.innerHTML = `
        <fieldset class="form-order__fieldset form-order__fieldset_input">
            <input class="form-order__input" type="text" name="name"
               required placeholder="Фамилия Имя Отчество">
            <input class="form-order__input" type="tel" name="phone"
               required placeholder="Телефон">
            <input class="form-order__input" type="email" name="email"
               required placeholder="E-mail">
            <input class="form-order__input" type="text" name="address"
                placeholder="Адрес доставки">
            <textarea class="form-order__textarea" name="comments"
                placeholder="Комментарий к заказу"></textarea>
        </fieldset>
        <fieldset class="form-order__fieldset form-order__fieldset_radio">
            <legend class="form-order__legend">Доставка</legend>
            <label class="form-order__label radio">
              <input class="radio__input" type="radio" name="deliveryType"
                value="delivery">
              Доставка
            </label>
            <label class="form-order__label radio">
              <input class="radio__input" type="radio" name="deliveryType"
                required value="pick-up">
                Самовывоз
            </label>
        </fieldset>
        <fieldset class="form-order__fieldset form-order__fieldset_radio">
            <legend class="form-order__legend">Оплата</legend>
            <label class="form-order__label radio">
               <input class="radio__input" type="radio" name="paymentType" 
                 required value="card">
                 Картой при получении
            </label>
            <label class="form-order__label radio">
                <input class="radio__input" type="radio" name="paymentType" 
                  required value="cash">
                  Наличными при получении
            </label>
        </fieldset>
        `;

        form.addEventListener('submit', e => {
            e.preventDefault();
            console.log('Происходит отправка заказа');
        })

        this.containerElement.append(form);
    };
};
/*products: [{id: 5,
   article: "16954071925", 
   name: "Стол компьютерный Ascetic", 
   price: 1795,…}]
       0: {id: 5, 
           article: "16954071925", 
           name: "Стол компьютерный Ascetic", 
           price: 1795,…}
totalCount: 1
totalPrice: 1795
*/