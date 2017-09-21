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
    $(button).attr('value', 'adding...').prop('disabled', true);

    var actionValue = $.ajax({
      url: '/cart/add.js',
      type: 'POST',
      data: cartForm,
      dataType: 'json'
    })
    .done(function(data) {
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      error = jqXHR.responseJSON.description;
      cartError = true;
    })
    .always(function(data){
      if (!cartError) {
        AjaxCart.getCart();
      }
    });
    $(button).attr('value', completedText).prop('disabled', false);
    console.log(actionValue);
  },
  getCart() {
    var value = $.ajax({
      url: '/cart.js',
      type: 'GET',
      dataType: 'json'
    })
    .done(function() {
    })
    .fail(function() {
    })
    .always(function(data) {
    });
    console.log(value);
  }
};

window.AjaxCart = AjaxCart;

$(function() {
  AjaxCart.init();


  $('#add').click(function(e){
    e.preventDefault();
    var form = $(this).closest('form');
    AjaxCart.addToCart(form);
  });
});
