/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */

// Dropin Tools
import { events } from '@dropins/tools/event-bus.js';
import { initializers } from '@dropins/tools/initializer.js';

// Cart Dropin Modules
import * as cartApi from '@dropins/storefront-cart/api.js';
import CartSummaryList from '@dropins/storefront-cart/containers/CartSummaryList.js';
import { OrderSummary } from '@dropins/storefront-cart/containers/OrderSummary.js';
import { render as cartProvider } from '@dropins/storefront-cart/render.js';

// Checkout Dropin Modules
import * as checkoutApi from '@dropins/storefront-checkout/api.js';
import Checkout from '@dropins/storefront-checkout/containers/Checkout.js';
import EstimateShipping from '@dropins/storefront-checkout/containers/EstimateShipping.js';
import { render as checkoutProvider } from '@dropins/storefront-checkout/render.js';

// Auth Dropin Modules
import * as authApi from '@dropins/storefront-auth/api.js';
import AuthCombine from '@dropins/storefront-auth/containers/AuthCombine.js';
import SignUp from '@dropins/storefront-auth/containers/SignUp.js';
import { render as authProvider } from '@dropins/storefront-auth/render.js';

import * as orderConfirmationApi from '@dropins/storefront-order-confirmation/api.js';
import OrderConfirmation from '@dropins/storefront-order-confirmation/containers/OrderConfirmation.js';
import { render as orderConfirmationProvider } from '@dropins/storefront-order-confirmation/render.js';

import { loadScript } from '../../scripts/aem.js';
import { performMonolithGraphQLQuery } from '../../scripts/commerce.js';
import { getUserTokenCookie } from '../../scripts/dropins.js';
import { MUTATION_PLACE_ORDER, MUTATION_SET_PAYMENT_METHOD, QUERY_GET_STRIPE_CONFIG } from '../../scripts/stripe.js';
import { createModal } from '../modal/modal.js';

export default async function decorate(block) {
  let modal = null;

  // Initialize Dropins
  initializers.register(checkoutApi.initialize, {});

  events.on(
    'authenticated',
    (isAuthenticated) => {
      if (isAuthenticated && modal) {
        modal.removeModal();
        modal = null;
      }
    },
    { eager: true },
  );

  // Display order confirmation
  events.on('checkout/order', (orderData) => {
    const token = getUserTokenCookie();
    const orderRef = token ? orderData.number : orderData.token;
    const encodedOrderRef = encodeURIComponent(orderRef);

    window.history.pushState(
      {},
      '',
      `/order-confirmation?orderRef=${encodedOrderRef}`,
    );

    checkoutProvider.unmount(block);

    initializers.register(orderConfirmationApi.initialize, {});

    const onSignUpClick = async ({
      inputsDefaultValueSet,
      addressesData,
    }) => {
      const signUpForm = document.createElement('div');

      authProvider.render(SignUp, {
        routeSignIn: () => '/customer/login',
        routeRedirectOnEmailConfirmationClose: () => '/customer/account',
        inputsDefaultValueSet,
        addressesData,
      })(signUpForm);

      modal = await createModal([signUpForm]);
      modal.showModal();
    };

    orderConfirmationProvider.render(OrderConfirmation, {
      orderRef,
      orderData,
      onSignUpClick,
      routeHome: () => '/',
      routeSupport: () => '/support',
    })(block);
  });

  const onSignInClick = async (initialEmailValue) => {
    const signInForm = document.createElement('div');

    authProvider.render(AuthCombine, {
      signInFormConfig: { renderSignUpLink: true, initialEmailValue },
      signUpFormConfig: {},
      resetPasswordFormConfig: {},
    })(signInForm);

    modal = await createModal([signInForm]);
    modal.showModal();
  };

  // TODO: Only load this when Stripe is on page.
  loadScript('https://js.stripe.com/v3');

  return checkoutProvider.render(Checkout, {
    onSignInClick: async () => onSignInClick(),
    onSignOutClick: () => {
      authApi.revokeCustomerToken();
    },
    onCheckoutDataUpdate: () => {
      cartApi.refreshCart().catch(console.error);
    },
    routeHome: () => '/',
    routeCart: () => '/cart',
    slots: {
      OrderSummary: (ctx) => {
        const orderSummary = document.createElement('div');

        cartProvider.render(OrderSummary, {
          slots: {
            EstimateShipping: (esCtx) => {
              const estimateShippingForm = document.createElement('div');

              checkoutProvider.render(EstimateShipping)(estimateShippingForm);

              esCtx.appendChild(estimateShippingForm);
            },
          },
        })(orderSummary);

        ctx.appendChild(orderSummary);
      },
      CartSummaryList: (checkoutCtx) => {
        const cartSummaryList = document.createElement('div');
        cartSummaryList.classList.add('cart-summary-list');

        cartProvider.render(CartSummaryList, {
          slots: {
            Heading: (headingCtx) => {
              // eslint-disable-next-line max-len
              const { title, editLink } = checkoutCtx.dictionary.Checkout.Slots.CartSummaryList.Heading;

              const cartSummaryListHeading = document.createElement('div');
              cartSummaryListHeading.classList.add(
                'cart-summary-list__heading',
              );

              const cartSummaryListHeadingText = document.createElement('div');
              cartSummaryListHeadingText.classList.add(
                'cart-summary-list__heading-text',
              );

              cartSummaryListHeadingText.innerText = title.replace(
                '{count}',
                headingCtx.count,
              );
              const editCartLink = document.createElement('a');
              editCartLink.classList.add('cart-summary-list__edit');
              editCartLink.href = '/cart';
              editCartLink.rel = 'noreferrer';
              editCartLink.innerText = editLink;

              cartSummaryListHeading.appendChild(
                cartSummaryListHeadingText,
              );
              cartSummaryListHeading.appendChild(editCartLink);
              headingCtx.appendChild(cartSummaryListHeading);
            },
          },
        })(cartSummaryList);

        checkoutCtx.appendChild(cartSummaryList);
      },
      PaymentMethods: async (context) => {
        context.addPaymentMethodHandler('checkmo', {
          render: (ctx, element) => {
            if (element) {
              // clear the element first
              element.innerHTML = '';
            }

            // Optionally, create and render some custom content here.
            // const $content = document.createElement('div');
            // $content.innerText = 'Custom Check / Money order handler';
            // ctx.appendHTMLElement($content);
          },
        });
        context.addPaymentMethodHandler('stripe_payments', {
          render: async (ctx, slotElement) => {
            const cartId = sessionStorage.getItem('DROPINS_CART_ID');
            // This implementation follows instructions here:
            // https://docs.stripe.com/connectors/adobe-commerce/custom-storefront
            const {
              data: {
                getStripeConfiguration: { apiKey, elementsOptions },
              },
            } = await performMonolithGraphQLQuery(
              QUERY_GET_STRIPE_CONFIG,
              null,
              false,
            );

            // eslint-disable-next-line no-undef
            const stripe = Stripe(apiKey);

            const elements = stripe.elements({
              ...JSON.parse(elementsOptions),
              // TODO: get actual amount. localized ie grant_total.value * exchangeRate * 100?
              amount: 4300,
              // currency: 'usd' // TODO: get actual currency
            });

            const paymentElement = elements.create('payment');
            paymentElement.mount(slotElement);
            ctx.onPlaceOrder(async () => {
              await elements.submit();
              // 1. create Stripe payment method
              const createPaymentMethodResult = await stripe.createPaymentMethod({
                elements,
              });
              if (createPaymentMethodResult?.paymentMethod) {
                // 2. set payment method in Commerce
                await performMonolithGraphQLQuery(
                  MUTATION_SET_PAYMENT_METHOD,
                  {
                    cartId,
                    paymentMethodId: createPaymentMethodResult.paymentMethod.id,
                  },
                  false,
                );

                // 3. place order in Commerce
                const placeOrderData = await performMonolithGraphQLQuery(
                  MUTATION_PLACE_ORDER,
                  { cartId },
                  false,
                );
                const order = placeOrderData?.data?.placeOrder?.orderV2;
                if (order) {
                  // TODO: Impossible without "checkout signal"
                  // completeCheckout(order!.order_number);

                  // @ts-ignore
                  events.emit('checkout/order', order);

                  // @ts-ignore
                  events.emit('cart/reset', undefined);
                } else {
                  // TODO: Something broke.
                }
              }
            });
          },
        });
      },
    },
  })(block);
}
