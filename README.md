## AjaxCart

Project to extract and reuse Shopify ajax add-to-cart functions

#### Install
---
##### Snippets

* Copy the files in the `/dist/snippets` directory into Shopify theme `/snippets` directory.

* In `/layout/theme.liquid` include `{% include 'cart-drawer' %}`

* In `/templates/product.liquid` include `{% include 'js-cart-fields' %}` immediately after the beginning of the `<form>`.

* In `/templates/product.liquid` replace the variant loop with `{% include variant-loop.liquid %}` - see snippet for full markup. 

* *Note that all snippets above are for convenience only. They are not strictly required, but they are quick helpers that help store/hook into data required to execute certain actions in AjaxCart. See `/dist/js/product.js` for examples on how the snippets are being used to pass data to AjaxCart. `/dist/js/product.js` can be used as a starting point to manage cart from PDP*

##### JS

* From the `/dist/js` directory, include `ajaxCart.js` in project asset pipeline. Either include it directly in the `<head>` (`<script src="/javascripts/ajaxCart.js" type="text/javascript"></script>`) or add to the pipeline of file that is compiled (using webpack, or other).


#### Usage
---

AjaxCart currently has 4 main methods:

* `addToCart()`
* `getCart()`
* `removeFromCart()`
* `updateQuantity()`

##### `addToCart()`

Required paramaters:
* Form

Optional parameters:
* Trigger button element
* Callback function

If no button is specified, the first button inside the form will be assumed. This is for disabling/enabling the form button to avoide multiple submissions. A callback function is also not required, but if specified will recieve either the cart object, or else relevant error messages.

Example usage:
```
AjaxCart.addToCart(form, $(button), function(cartOrError){
  $('.cart-drawer').prepend(newLineItemHtml);
  console.log(cartOrError);
});
```

See `/dist/js/product.js` for complete example.
