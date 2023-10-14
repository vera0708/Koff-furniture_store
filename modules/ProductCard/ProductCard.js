import { API_URL } from "../../const";
import { CartButton } from "../../features/CartButton/CartButton";
import { LikeButton } from "../../features/LikeButton/LikeButton";
import { addContainer } from "../addContainer";

export class ProductCard {
    static instance = null;

    constructor() {
        if (!ProductCard.instance) {
            ProductCard.instance = this;
            this.element = document.createElement('section');
            this.element.classList.add('product');
            this.containerElement = addContainer(this.element, 'product__container');
            this.isMounted = false;
        }
        return ProductCard.instance;
    }

    mount(parent, data) {
        this.render(data);
        if (this.isMounted) {
            return;
        };

        parent.append(this.element);
        this.isMounted = true;
    }

    unmount() {
        this.element.remove();
        this.isMounted = false;
    };

    render(data) {
        this.containerElement.textContent = '';

        const titleElem = document.createElement('h2');
        titleElem.classList.add('product__title');
        titleElem.textContent = data.name;

        const productPicture = document.createElement('div');
        productPicture.classList.add('product__picture');

        const productSliderMain = document.createElement('div');
        productSliderMain.classList.add('product__slider-main', 'swiper');

        const productMainList = document.createElement('div');
        productMainList.classList.add('product__main-list', 'swiper-wrapper');

        const mainSliderItems = data.images.map(item => {
            const productSlide = document.createElement('div');
            productSlide.classList.add('product__slide', 'swiper-slide');

            const productImage = document.createElement('img');
            productImage.classList.add('product__image');
            productImage.src = `${API_URL}${item}`;

            productSlide.append(productImage);
            return productSlide;
        });

        productMainList.append(...mainSliderItems);
        productSliderMain.append(productMainList);

        productPicture.append(productSliderMain);

        if (data.images.length > 1) {
            const productArrowPrev = document.createElement('button');
            productArrowPrev.classList.add('product__arrow_prev', 'product__arrow');
            productArrowPrev.innerHTML = ` 
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="16" fill="white" fill-opacity="0.4" />
                <path
                  d="M11.864 16.0001L17.5253 10.1821C17.5719 10.1352 17.6087 10.0796 17.6337 10.0183C17.6587 9.95711 17.6712 9.89155 17.6707 9.82544C17.6701 9.75933 17.6565 9.69398 17.6305 9.63318C17.6045 9.57239 17.5668 9.51734 17.5194 9.47124C17.472 9.42513 17.4159 9.38888 17.3545 9.36458C17.293 9.34028 17.2273 9.32842 17.1612 9.32968C17.0951 9.33094 17.0299 9.34529 16.9694 9.37191C16.9088 9.39854 16.8542 9.43689 16.8086 9.48477L10.8086 15.6514C10.7178 15.7448 10.667 15.8699 10.667 16.0001C10.667 16.1303 10.7178 16.2554 10.8086 16.3488L16.8086 22.5154C16.8542 22.5633 16.9088 22.6017 16.9694 22.6283C17.0299 22.6549 17.0951 22.6693 17.1612 22.6705C17.2273 22.6718 17.293 22.6599 17.3545 22.6356C17.4159 22.6113 17.472 22.5751 17.5194 22.529C17.5668 22.4829 17.6045 22.4278 17.6305 22.367C17.6565 22.3062 17.6701 22.2409 17.6707 22.1748C17.6712 22.1087 17.6587 22.0431 17.6337 21.9819C17.6087 21.9207 17.5719 21.865 17.5253 21.8181L11.864 16.0001Z"
                  fill="currentColor" />
             </svg>
             `;
            const productArrowNext = document.createElement('button');
            productArrowNext.classList.add('product__arrow_next', 'product__arrow');
            productArrowNext.innerHTML = `  
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="16" transform="matrix(-1 0 0 1 32 0)" fill="white"
                  fill-opacity="0.4" />
                <path
                  d="M20.136 16.0001L14.4747 10.1821C14.4281 10.1352 14.3913 10.0796 14.3663 10.0183C14.3413 9.95711 14.3288 9.89155 14.3293 9.82544C14.3299 9.75933 14.3435 9.69398 14.3695 9.63318C14.3955 9.57239 14.4332 9.51734 14.4806 9.47124C14.528 9.42513 14.5841 9.38888 14.6455 9.36458C14.707 9.34028 14.7727 9.32842 14.8388 9.32968C14.9049 9.33094 14.9701 9.34529 15.0306 9.37191C15.0912 9.39854 15.1458 9.43689 15.1914 9.48477L21.1914 15.6514C21.2822 15.7448 21.333 15.8699 21.333 16.0001C21.333 16.1303 21.2822 16.2554 21.1914 16.3488L15.1914 22.5154C15.1458 22.5633 15.0912 22.6017 15.0306 22.6283C14.9701 22.6549 14.9049 22.6693 14.8388 22.6705C14.7727 22.6718 14.707 22.6599 14.6455 22.6356C14.5841 22.6113 14.528 22.5751 14.4806 22.529C14.4332 22.4829 14.3955 22.4278 14.3695 22.367C14.3435 22.3062 14.3299 22.2409 14.3293 22.1748C14.3288 22.1087 14.3413 22.0431 14.3663 21.9819C14.3913 21.9207 14.4281 21.865 14.4747 21.8181L20.136 16.0001Z"
                  fill="currentColor" />
            </svg>
            `;
            productSliderMain.append(productArrowPrev, productArrowNext);

            const productSliderThumbnails = document.createElement('div');
            productSliderThumbnails.classList.add('swiper', 'product__slider-thumbnails');

            const productThumbnailsList = document.createElement('div');
            productThumbnailsList.classList.add('swiper-wrapper', 'product__thumbnails-list');

            productSliderThumbnails.append(productThumbnailsList);

            const thumbnailsSliderItems = data.images.map(item => {
                const productSlide = document.createElement('div');
                productSlide.classList.add('product__thumbnails-slide', 'swiper-slide');

                const productImage = document.createElement('img');
                productImage.classList.add('product__thumbnails-img');
                productImage.src = `${API_URL}${item}`;
                productSlide.append(productImage);
                return productSlide;
            });

            productThumbnailsList.append(...thumbnailsSliderItems);

            productPicture.append(productSliderThumbnails);
        };
        // можно всё предыдущее в одну функцию
        const productInfo = document.createElement('div');
        productInfo.classList.add('product__info');

        const productPrice = document.createElement('p');
        productPrice.classList.add('product__price');
        productPrice.innerHTML = `${data.price.toLocaleString()}&nbsp;₽`;

        const productArticle = document.createElement('p');
        productArticle.classList.add('product__article');
        productArticle.innerHTML = `арт.${data.article}`;

        const productCharacteristics = document.createElement('div');
        productCharacteristics.classList.add('product__characteristics');

        const productCharacteristicsTitle = document.createElement('h3');
        productCharacteristicsTitle.classList.add('product__characteristics-title');
        productCharacteristicsTitle.textContent = 'Общие характеристики';

        const tableCharacteristics = document.createElement('table');
        tableCharacteristics.classList.add('product__characteristics-table', 'table');
        const tableRows = data.characteristics.map(item => {
            const tableRow = document.createElement('tr');
            tableRow.classList.add('table__row');

            const tableField = document.createElement('td');
            tableField.classList.add('table__field');
            tableField.textContent = item[0];

            const tableValue = document.createElement('td');
            tableValue.classList.add('table__value');
            tableValue.textContent = item[1];

            tableRow.append(tableField, tableValue);
            return tableRow;
        });

        tableCharacteristics.append(...tableRows);
        productCharacteristics.append(productCharacteristicsTitle, tableCharacteristics);

        const productButtons = document.createElement('div');
        productButtons.classList.add('product__btns');

        const productBtn = new CartButton('product__btn', 'В корзину').create(data.id);
        const productLike = new LikeButton('product__like').create(data.id);

        productButtons.append(productBtn, productLike);

        productInfo.append(productPrice, productArticle, productCharacteristics, productButtons);
        this.containerElement.append(titleElem, productPicture, productInfo);
    };
};
/*      <div class="swiper product__slider-thumbnails">
            <div class="swiper-wrapper product__thumbnails-list">
              <div class="swiper-slide product__thumbnails-slide">
                <img class="product__thumbnails-img" src="/img/chair_product.jpg">
              </div>
              <div class="swiper-slide product__thumbnails-slide">
                <img class="product__thumbnails-img" src="https://swiperjs.com/demos/images/nature-2.jpg">
              </div>
            </div>
          </div>
        </div>

<div class="product__info">
          <div class="product__characteristics">

            <div class="product__btns">
              <button class="product__btn" type="button">В корзину</button>
              <button class="product__like" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path
                    d="M8.4135 13.8733C8.18683 13.9533 7.8135 13.9533 7.58683 13.8733C5.6535 13.2133 1.3335 10.46 1.3335 5.79332C1.3335 3.73332 2.9935 2.06665 5.04016 2.06665C6.2535 2.06665 7.32683 2.65332 8.00016 3.55998C8.6735 2.65332 9.7535 2.06665 10.9602 2.06665C13.0068 2.06665 14.6668 3.73332 14.6668 5.79332C14.6668 10.46 10.3468 13.2133 8.4135 13.8733Z"
                    fill="white" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

*/