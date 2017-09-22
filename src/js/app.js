// REQUIRE ALL SCSS FROM APP.SCSS
require("./../scss/app.scss");

// IMPORT DEPENDENCIES
import $ from 'jquery';

const AjaxCart = {
  settings: {},
  init() {
  },

  addToCart(form, button = $('form').find('input[type=submit]')) {
    var cartForm = $(form).serialize();
    var completedText = $(button).attr('value');
    var cartError = false;
    var error = '';
    var returnValue = '';
    $(button).attr('value', 'adding...').prop('disabled', true);

    var product = $.ajax({
      url: '/cart/add.js',
      type: 'POST',
      data: cartForm,
      dataType: 'json'
    });
    var cart = $.ajax({
      url: '/cart.js',
      type: 'GET',
      dataType: 'json'
    });

    product.done(function(productData){
      var product = productData;
      cart.done(function(cartData){
        var cart = cartData;
        console.log(cart);
        console.log(product);
      });
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    });

    $(button).attr('value', completedText).prop('disabled', false);
  },
};

window.AjaxCart = AjaxCart;

$(function() {
  $('#add').click(function(e){
    e.preventDefault();
    var form = $(this).closest('form');
    var response = AjaxCart.addToCart(form);
  });
});
