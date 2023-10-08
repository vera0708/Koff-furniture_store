import 'normalize.css';
import './style.scss';
import Navigo from 'navigo';
import { Header } from './modules/Header/Header';
import { Footer } from './modules/Footer/Footer';
import { Main } from './modules/Main/Main';
import { Order } from './modules/Order/Order';
import { ProductList } from './modules/ProductList/ProductList';
import { ApiService } from './services/ApiService';

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
    const api = new ApiService();

    new Header().mount();
    new Main().mount();
    new Footer().mount();
    // const header = new Header();
    // console.log('new Header(): ', header);
    /*const headerElement = new Header().element;
    headerElement.innerHTML = '123';
    console.log(new Header().element.innerHTML);*/

    productSlider();

    const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });

    router
        .on("/",
            async () => {
                const product = await api.getProducts();
                new ProductList().mount(new Main().element, product);
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
            new ProductList().mount(new Main().element, [5, 6, 1, 2, 3, 7, 8], 'Category');
        }, {
            leave(done) {
                console.log('leave category')
                done()
            },
        })
        .on("/favorite", () => {
            console.log('favorite');
            new ProductList().mount(new Main().element, [7, 8, 5, 6, 1], 'favorite');
        }, {
            leave(done) {
                console.log('leave category')
                done()
            },
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
            new Order().mount(new Main().element);
        }, {
            leave(done) {
                console.log('leave order')
                done()
            },
        })
        .notFound(() => {
            new Main().element.innerHTML = `
            <h2>Страница не найдена</h2>
            <p>Через 5 секунд вы будете перенаправлены
                <a>на главную страницу</a>
            </p>`;

            setTimeout(() => {
                router.navigate('/');
            }, 5000);
        });

    router.resolve();
};

init();