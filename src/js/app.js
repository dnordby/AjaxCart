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
    var returnValue = '';
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

    var cart = getCart().done(function(cartData){
      return(cartData);
    });

    $(button).attr('value', completedText).prop('disabled', false);
    return(cart);
  },
};

window.AjaxCart = AjaxCart;

$(function() {
  $('#add').click(function(e){
    e.preventDefault();
    var form = $(this).closest('form');
    var response = AjaxCart.addToCart(form);
    console.log(response);
  });
});
