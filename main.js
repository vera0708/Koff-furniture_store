import 'normalize.css';
import './style.scss';
import Navigo from 'navigo';
import { Header } from './modules/Header/Header';
import { Footer } from './modules/Footer/Footer';
import { Main } from './modules/Main/Main';
import { Order } from './modules/Order/Order';
import { ProductList } from './modules/ProductList/ProductList';
import { ApiService } from './services/ApiService';
import { Catalog } from './modules/Catalog/Catalog';

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
    const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });

    new Header().mount();
    new Main().mount();
    new Footer().mount();

    api.getProductCategories().then(data => {
        new Catalog().mount(new Main().element, data);
        router.updatePageLinks();
    });

    productSlider();

    router
        .on("/",
            async () => {
                const product = await api.getProducts();
                new ProductList().mount(new Main().element, product);
                router.updatePageLinks();
            }, {
            leave(done) {
                new ProductList().unmount();
                done()
            },
            already() {
                console.log('already')
            },
        })
        .on("/category",
            async ({ params: { slug } }) => {
                const product = await api.getProducts();
                new ProductList().mount(new Main().element, product, slug);
                router.updatePageLinks();
            }, {
            leave(done) {
                new ProductList().unmount();
                done()
            },
        })
        .on("/favorite",
            async () => {
                const product = await api.getProducts();
                new ProductList().mount(new Main().element, product, 'favorite');
                router.updatePageLinks();
            }, {
            leave(done) {
                new ProductList().unmount();
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
            <h2 style="font-size: 48px; text-align: center; color: #780096; margin-top: 25px; margin-bottom: 35px;">Страница не найдена</h2>
            <p style="font-size: 38px; text-align: center; color: #de5675; margin-bottom: 25px;">404 ошибка</p>
            <p style="font-size: 18px; text-align: center; margin-bottom: 25px;"
            >Запрашиваемая вами страница отсутствует. <br>
            Проверьте правильность адреса страницы</p>
            <p style="font-size: 16px; text-align: center; margin-bottom: 25px;">Через 5 секунд вы будете перенаправлены
                <a style="color: #559de0; "font-size: 18px;">на главную страницу</a>
            </p>`;

            setTimeout(() => {
                router.navigate('/');
            }, 5000);
        }, {
            leave(done) {
                new Main().element.remove();
                done()
            },
        });

    router.resolve();
};

init();