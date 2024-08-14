import{s as m}from"./state.js";import{C as R,a as A,t as I}from"./CartFragment.js";import{events as g}from"@dropins/tools/event-bus.js";import{f as v,h as D}from"./resetCart.js";function _(a){const{cart:r,locale:t="en-US"}=a;return{id:r.id,items:E(r.items,t),prices:{subtotalExcludingTax:r.subtotal.excludingTax,subtotalIncludingTax:r.subtotal.includingTax},totalQuantity:r.totalQuantity,possibleOnepageCheckout:void 0,giftMessageSelected:void 0,giftWrappingSelected:void 0,source:void 0}}function E(a,r){return a.map(t=>{var e;return{canApplyMsrp:!1,formattedPrice:h(r,t.price.currency,t.price.value),id:t.uid,prices:{price:t.price},product:{productId:t.uid,name:t.name,sku:t.sku,topLevelSku:void 0,specialToDate:void 0,specialFromDate:void 0,newToDate:void 0,newFromDate:void 0,createdAt:void 0,updatedAt:void 0,manufacturer:void 0,countryOfManufacture:void 0,categories:t.url.categories,productType:void 0,pricing:{regularPrice:t.regularPrice.value,minimalPrice:void 0,maximalPrice:void 0,specialPrice:(e=t.discount)==null?void 0:e.value,tierPricing:void 0,currencyCode:t.regularPrice.currency},canonicalUrl:t.url.urlKey,mainImageUrl:t.image.src,image:{src:t.image.src,alt:t.image.alt}},configurableOptions:void 0,quantity:t.quantity}})}function h(a,r,t){const e=a.replace("_","-");return new Intl.NumberFormat(e,{style:"currency",currency:r}).format(t)}const c={SHOPPING_CART_CONTEXT:"shoppingCartContext",PRODUCT_CONTEXT:"productContext",CHANGED_PRODUCTS_CONTEXT:"changedProductsContext"},u={OPEN_CART:"open-cart",ADD_TO_CART:"add-to-cart",REMOVE_FROM_CART:"remove-from-cart",SHOPPING_CART_VIEW:"shopping-cart-view"};function l(){return window.adobeDataLayer=window.adobeDataLayer||[],window.adobeDataLayer}function i(a,r){const t=l();t.push({[a]:null}),t.push({[a]:r})}function O(a,r){l().push(e=>{const s=e.getState?e.getState():{};e.push({event:a,eventInfo:{...s,...r}})})}function M(a,r,t){const e=_({cart:a,locale:t});i(c.SHOPPING_CART_CONTEXT,{...e}),O(u.OPEN_CART),E(r,t).forEach(o=>{i(c.PRODUCT_CONTEXT,o.product),p(e,[o],u.ADD_TO_CART)})}function w(a,r){const t=_({cart:a,locale:r});i(c.SHOPPING_CART_CONTEXT,{...t}),O(u.SHOPPING_CART_VIEW)}function p(a,r,t){const e={items:r};i(c.SHOPPING_CART_CONTEXT,{...a}),i(c.CHANGED_PRODUCTS_CONTEXT,{...e}),O(t)}function N(a,r,t){const e=_({cart:a,locale:t}),s=e.items,o=l(),C=o.getState?o.getState():{},{shoppingCartContext:{items:P=[]}={}}=C;r.forEach(f=>{const d=P.find(T=>T.id===f.uid),n=s.find(T=>T.id===f.uid);!n&&!d||(!d&&n?(i(c.PRODUCT_CONTEXT,n.product),p(e,[n],u.ADD_TO_CART)):d&&!n?(i(c.PRODUCT_CONTEXT,d.product),p(e,[d],u.REMOVE_FROM_CART)):n.quantity>d.quantity?(i(c.PRODUCT_CONTEXT,n.product),p(e,[n],u.ADD_TO_CART)):(i(c.PRODUCT_CONTEXT,n.product),p(e,[n],u.REMOVE_FROM_CART)))})}const y=`
  mutation UPDATE_PRODUCTS_FROM_CART_MUTATION(
      $cartId: String!, 
      $cartItems: [CartItemUpdateInput!]!,
      ${R}
    ) {
    updateCartItems(
      input: {
        cart_id: $cartId
        cart_items: $cartItems  
      }
    ) {
      cart {
        ...CartFragment
      }

    }
  }
  ${A}
`,F=async a=>{const r=m.cartId;if(!r)throw Error("Cart ID is not set");return v(y,{variables:{cartId:r,cartItems:a.map(({uid:t,quantity:e})=>({cart_item_uid:t,quantity:e}))}}).then(({errors:t,data:e})=>{var C;const s=[...((C=e==null?void 0:e.addProductsToCart)==null?void 0:C.user_errors)??[],...t??[]];if(s.length>0)return D(s);const o=I(e.updateCartItems.cart);return g.emit("cart/updated",o),g.emit("cart/data",o),o&&N(o,a,m.locale??"en-US"),o})};export{M as a,N as b,w as p,F as u};
