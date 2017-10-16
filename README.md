## AjaxCart

Shopify project to add/remove/update items to cart.

#### INSTALL
---
##### Snippets

* Copy the files in the `/dist/snippets` directory into Shopify theme `/snippets` directory.

* In `/layout/theme.liquid` include `{% include 'cart-drawer' %}`

* In `/templates/product.liquid` include `{% include 'js-cart-fields' %}` immediately after the beginning of the `<form>`.

* In `/templates/product.liquid` replace the variant loop with `{% include variant-loop.liquid %}` - see snippet for full markup. 

* *Note that all snippets above are for convenience only. They are not strictly required, but they are quick helpers that help store/hook into data required to execute certain actions in AjaxCart. See `/dist/js/product.js` for examples on how the snippets are being used to pass data to AjaxCart. `/dist/js/product.js` can be used as a starting point to manage cart from PDP*

##### JS

* From the `/dist/js` directory, include `ajaxCart.js` in project asset pipeline. Either include it directly in the `<head>` (`<script src="/javascripts/ajaxCart.js" type="text/javascript"></script>`) or add to the pipeline of file that is compiled (using webpack, or other).


#### USAGE
---

AjaxCart currently has 4 main methods:

* `addToCart()`
* `getCart()`
* `removeFromCart()`
* `updateQuantity()`

For complete examples of each, see `/dist/js/product.js`. Note that AjaxCart does not handle visual/theme updates to the cart. It rerutns cart objects or errors, but it does not adjust prices or quantities, remove line items, or otherwise update the cart without a page refresh: any updates must be made by the theme developer. `/dist/js/product.js` can be used as an example/template as to how events/return values can be handled.

---
##### Add to cart - `.addToCart(form, button = $(form).find('input[type=submit]'), fn)`

##### _Returns updated cart object or errors._

Required paramaters:
* Form

Optional parameters:
* Trigger button element
* Callback function

If no button is specified, the first button inside the form will be assumed. This is for disabling/enabling the form button to avoide multiple submissions. A callback function is also not required, but if specified will recieve either the cart object, or else relevant error messages. If no callback is specified, nothing will be returned. `addToCart()` is the only function that must be handled with a callback. The other methods can be assigned to variables, rather than handled with a callback.

Example usage:
```
AjaxCart.addToCart(form, $(button), function(cartOrError){
  $('.cart-drawer').prepend(newLineItemHtml);
  console.log(cartOrError);
});
```

---
##### Get cart - `.getCart()`

##### _Returns the cart object._

Example usage:
```
var getCart = AjaxCart.getCart();
console.log(getCart);
```


---
##### Remove variant from cart - `.removeFromCart(variantId)`

##### _Removes all quantities of the specified variant ID from the cart. Returns the cart object once the applicable products have been removed._

Example usage:
```
var updatedCart = AjaxCart.removeFromCart(variantId);
console.log(updatedCart);
```



---
##### Update variant quantity - `.updateQuantity(action, variantId, currentQuantity, availableQuantity)`

##### _Returns updated cart or errors._

Required paramaters:
* Update action - string, must be either 'increase' or 'decrease'
* Variant ID to be updated
* The current quantity in the cart
* The variant's total available quantity

Example usage:
```
var updatedCart = AjaxCart.updateQuantity(action, variantId, currentQuantity, availableQuantity);
```




