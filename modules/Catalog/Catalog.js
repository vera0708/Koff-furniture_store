import { addContainer } from "../addContainer";

export class Catalog {
    static instance = null;

    constructor() {
        if (!Catalog.instance) {
            Catalog.instance = this;
            this.element = document.createElement('nav');
            this.element.classList.add('catalog');
            this.containerElement = addContainer(this.element, 'catalog__container');

            this.isMounted = false;
        }
        return Catalog.instance;
    }

    mount(parent, data) {
        if (this.isMounted) {
            return;
        };

        this.renderListElem(data);

        parent.prepend(this.element);
        this.isMounted = true;
    }

    unmount() {
        this.element.remove();
        this.isMounted = false;
    };

    renderListElem(data) {
        const listElem = document.createElement('ul');
        listElem.classList.add('catalog__list');

        const listItems = data.map((item) => {
            const listItemElem = document.createElement('li');
            listItemElem.classList.add('catalog__item');
            const link = document.createElement('a');
            link.classList.add('catalog__link');
            link.href = `/category?slug=${item}`;
            link.textContent = item;

            listItemElem.append(link);
            return listItemElem;
        });

        listElem.append(...listItems);
        this.containerElement.append(listElem);
    }
};

/*
    <div class="catalog">
      <div class="container catalog__container">
        <ul class="catalog__list">
          <li class="catalog__item">
            <a href="/category?slug=Диваны" class="catalog__link">
              Диваны
            </a>
          </li>
          <li class="catalog__item">
            <a class="catalog__link catalog__link_active" href="/category?slug=Шкафы">
              Шкафы
            </a>
          </li>
          <li class="catalog__item">
            <a href="/category?slug=Стулья" class="catalog__link">
              Стулья
            </a>
          </li>
          <li class="catalog__item">
            <a href="/category?slug=Тумбы" class="catalog__link">
              Тумбы
            </a>
          </li>
          <li class="catalog__item">
            <a href="/category?slug=Кровати" class="catalog__link">
              Кровати
            </a>
          </li>
          <li class="catalog__item">
            <a href="/category?slug=Столы" class="catalog__link">
              Столы
            </a>
          </li>
          <li class="catalog__item">
            <a href="/category?slug=Комоды" class="catalog__link">
              Комоды
            </a>
          </li>
          <li class="catalog__item">
            <a href="/category?slug=Матрасы" class="catalog__link">
              Матрасы
            </a>
          </li>
          <li class="catalog__item">
            <a href="/category?slug=Пуфики" class="catalog__link">
              Пуфики
            </a>
          </li>
          <li class="catalog__item">
            <a href="/category?slug=Стеллажи" class="catalog__link">
              Стеллажи
            </a>
          </li>
        </ul>
      </div>
    </div>
 */