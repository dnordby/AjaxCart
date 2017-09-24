// REQUIRE ALL SCSS FROM APP.SCSS
require("./../scss/app.scss");

// IMPORT DEPENDENCIES
import $ from 'jquery';

const AjaxCart = {


  // ADD ITEM TO CART
  // RETURN ERROR, OR CART OBJECT
  addToCart(form, fn) {
    var button = $('form').find('input[type=submit]')
    var cartForm = $(form).serialize();
    var completedText = $(button).attr('value');
    var cart = getCart();
    var product = productAdded();
    $(button).attr('value', 'adding...').prop('disabled', true);

    function productAdded() {
      return $.ajax({
        url: '/cart/add.js',
        type: 'POST',
        data: cartForm,
        dataType: 'json'
      });
    }
    function getCart() {
      return $.ajax({
        url: '/cart.js',
        type: 'GET',
        dataType: 'json'
      });
    }

    $.when(cart, product).done(function(cartData, productData){
      fn(cartData);
    }).fail(function(error){
      fn(error.responseJSON.description);
    });

    $(button).attr('value', completedText).prop('disabled', false);
  },


  // GET THE CART
  getCart() {
    var cart = getCart().done(function(data){
      return(data);
    });

    function getCart() {
      return $.ajax({
        url: '/cart.js',
        type: 'GET',
        dataType: 'json'
      });
    }

    return(cart);
  },


  // REMOVE ALL QUANTITIES OF VARIANT FROM CART
  removeFromCart(variantId) {
    var variantId = parseInt(variantId);
    var updateHash = {quantity: 0, id: variantId};
    var updatedCart = updateCart().done(function(data){
      return(data);
    });

    function updateCart() {
      return $.ajax({
        url: '/cart/change.js',
        type: 'POST',
        dataType: 'json',
        data: updateHash,
      });
    }

    return(updatedCart);
  },


  // CHANGE QUANTITY GIVEN VARIANT ID
  changeQuantity(variantId, quantity){
    var updateHash = `{"updates": {"${variantId}": ${itemQuantity}}}`;
    updateHash = JSON.parse(updateHash);
    var updatedCart = quantityUpdate().done(function(data){
      return(data);
    });

    function quantityUpdate() {
      return $.ajax({
        url: '/cart/update.js',
        type: 'POST',
        dataType: 'json',
        data: updateHash
      });
    }

    return(updatedCart);
  },


  // UPDATE QUANTITY CHECK
  updateQuantity(action, currentQuantity, variantId, productId) {
    var action = action;
    var quantity = currentQuantity;
    var variantId = variantId;
    var productId = productId;

    if ( (quantity == 1) && (action == 'subtract') ) {
      // INVOKE REMOVE FROM CART
      AjaxCart.removeFromCart(variantId);

    } else if ( (quantity > 1) && (action == 'subtract') ) {
      // UPDATE CART QUANTITY
      quantity--;
      AjaxCart.changeQuantity(variantId, quantity);

    } else if ( (action == 'increase')  ) {
      // CHECK FOR AVAILABILITY, AND THEN PROCESS
      // quantity++;
      // variantAvailable(productId, variantId, quantity)
    }
  }
};

window.AjaxCart = AjaxCart;

$(function() {
  // ADD TO CART
  $('#add').click(function(e){
    e.preventDefault();
    var form = $(this).closest('form');
    var response = '';
    AjaxCart.addToCart(form, function(data){
      console.log(data);
    });
  });

  // GET CART
  var getCart = AjaxCart.getCart();
  console.log(getCart);
});
