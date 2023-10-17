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
import { FavoriteService } from './services/storageService';
import { Pagination } from './features/Pagination/Pagination';
import { BreadCrumbs } from './features/BreadCrumbs/BreadCrumbs';
import { ProductCard } from './modules/ProductCard/ProductCard';
import { productSlider } from './features/ProductSlider/ProductSlider';
import { Cart } from './modules/Cart/Cart';

// const productSlider = () => {
//     Promise.all([
//         import('swiper/modules'),
//         import('swiper'),
//         import('swiper/css')
//     ]).then(([{ Navigation, Thumbs }, Swiper]) => {
//         const swiperThumbnails = new Swiper.default(".product__slider-thumbnails", {
//             spaceBetween: 10,
//             slidesPerView: 4,
//             freeMode: true,
//             watchSlidesProgress: true,
//         });

//         new Swiper.default(".product__slider-main", {
//             spaceBetween: 10,
//             navigation: {
//                 nextEl: ".product__arrow_next",
//                 prevEl: ".product__arrow_prev",
//             },
//             modules: [Navigation, Thumbs],
//             thumbs: {
//                 swiper: swiperThumbnails,
//             },
//         });
//     });
// };

export const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });

const init = async () => {
    const api = new ApiService();

    new Header().mount();
    new Main().mount();
    new Footer().mount();

    // await api.getProductCategories().then(data => {
    //     new Catalog().mount(new Main().element, data);
    //     router.updatePageLinks();
    // });
    productSlider();

    router
        .on("/",
            async () => {
                new Catalog().mount(new Main().element);
                const products = await api.getProducts();
                new ProductList().mount(new Main().element, products);
                router.updatePageLinks();
            }, {
            leave(done) {
                new ProductList().unmount();
                new Catalog().unmount();
                done()
            },
            already(match) {
                match.route.handler(match)
            },
        },
        )
        .on("/category",
            async ({ params: { slug, page = 1 } }) => {
                (await new Catalog().mount(new Main().element)).setActiveLink(slug);
                const { data: products, pagination } = await api.getProducts(
                    {
                        category: slug,
                        page: page,
                    });

                new BreadCrumbs().mount(new Main().element, [{ text: slug }]);
                new ProductList().mount(new Main().element, products, slug);
                new Pagination()
                    .mount(new ProductList().containerElement)
                    .update(pagination);
                router.updatePageLinks();
            }, {
            leave(done) {
                new BreadCrumbs().unmount();
                new ProductList().unmount();
                new Catalog().unmount();
                done()
            },
            already(match) {
                match.route.handler(match)
            },
        })
        .on("/favorite",
            async ({ params }) => {
                new Catalog().mount(new Main().element);
                const favorite = new FavoriteService().get();
                const { data: products, pagination } = await api.getProducts(
                    {
                        list: favorite.join(','),
                        page: params?.page || 1
                    });
                new BreadCrumbs().mount(new Main().element, [{ text: 'Избранное' }]);
                new ProductList().mount(new Main().element,
                    products,
                    'Избранное',
                    'Вы ещё ничего не добавили в Избранное');

                // if (pagination?.totalProducts > pagination?.limit) {
                new Pagination()
                    .mount(new ProductList().containerElement)
                    .update(pagination);
                // }
                router.updatePageLinks();
            }, {
            leave(done) {
                new BreadCrumbs().unmount();
                new ProductList().unmount();
                new Catalog().unmount();
                done()
            },
            already(match) {
                match.route.handler(match)
            },
        },
        )
        .on("/search",
            async ({ params: { q } }) => {
                new Catalog().mount(new Main().element);
                const { data: products, pagination } = await api.getProducts(
                    {
                        q,
                    });
                new BreadCrumbs().mount(new Main().element, [{ text: 'Поиск' }]);
                new ProductList().mount(new Main().element,
                    products,
                    `Поиск: ${q}`,
                    `Ничего не найдено по вашему запросу  ${q}`);
                new Pagination()
                    .mount(new ProductList().containerElement)
                    .update(pagination);
                router.updatePageLinks();
            }, {
            leave(done) {
                new BreadCrumbs().unmount();
                new ProductList().unmount();
                new Catalog().unmount();
                done()
            },
            already(match) {
                match.route.handler(match)
            }
        },
        )
        .on("/product/:id", async (obj) => {
            new Catalog().mount(new Main().element);
            const data = await api.getProductById(obj.data.id);
            new BreadCrumbs().mount(new Main().element, [
                {
                    text: data.category,
                    href: `/category?slug=${data.category}`
                },
                {
                    text: data.name,
                }
            ]);
            new ProductCard().mount(new Main().element, data);
            productSlider();
            console.log('obj:  ', obj)
        }, {
            leave(done) {
                new BreadCrumbs().unmount();
                new Catalog().unmount();
                new ProductCard().unmount()
                done()
            }
        }
        )
        .on("/cart", async () => {
            const cartItem = await api.getCart();
            new Cart().mount(new Main().element,
                cartItem,
                'Корзина пуста, добавьте товары');
        }, {
            leave(done) {
                new Cart().unmount();
                done()
            }
        })
        .on("/order/:id", ({ data: { id } }) => {
            api.getOrder(id).then(data => {
                new Order().mount(new Main().element,
                    data[0]);
            });
        }, {
            leave(done) {
                new Order().unmount();
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
        });

    router.resolve();

    api.getCart().then(data => {
        new Header().changeCount(data.totalCount);
    });
};

init();