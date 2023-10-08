import 'normalize.css';
import './style.scss';
import Navigo from 'navigo';
import { Header } from './modules/Header/Header';
import { Footer } from './modules/Footer/Footer';
import { Main } from './modules/Main/Main';
import { Order } from './modules/Order/Order';
import { ProductList } from './modules/ProductList/ProductList';

const productSlider = () => {
    Promise.all([
        import('swiper/modules'),
        import('swiper'),
        import('swiper/css')
    ]).then(([{ Navigation, Thumbs }, Swiper]) => {
        const swiperThumbnails = new Swiper.default(".product__slider-thumbnails", {
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
        });

        new Swiper.default(".product__slider-main", {
            spaceBetween: 10,
            navigation: {
                nextEl: ".product__arrow_next",
                prevEl: ".product__arrow_prev",
            },
            modules: [Navigation, Thumbs],
            thumbs: {
                swiper: swiperThumbnails,
            },
        });
    });
};

const init = () => {
    new Header().mount();
    new Main().mount();
    new Order().mount();
    new Footer().mount();
    // const header = new Header();
    // console.log('new Header(): ', header);
    /*const headerElement = new Header().element;
    headerElement.innerHTML = '123';
    console.log(new Header().element.innerHTML);*/

    productSlider();

    const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });

    router
        .on("/", () => {
            console.log('на главной');
            new ProductList().mount(new Main().element, [1, 2, 3]);
        }, {
            leave(done) {
                console.log('leave')
                done()
            },
            already() {
                console.log('already')
            },
        })
        .on("/category", (obj) => {
            console.log('category', obj);
        })
        .on("/favorite", () => {
            console.log('favorite');
        })
        .on("/search", () => {
            console.log('search');
        })
        .on("/product/:id", (obj) => {
            console.log('obj:  ', obj)
        })
        .on("/cart", () => {
            console.log('cart');
        })
        .on("/order", () => {
            console.log('order');
        })
        .notFound(() => {
            console.log(404);
        })

    router.resolve();
};

init();