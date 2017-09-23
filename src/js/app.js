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
    var returnValue = $.Deferred();
    $(button).attr('value', 'adding...').prop('disabled', true);

    var product = $.ajax({
      url: '/cart/add.js',
      type: 'POST',
      data: cartForm,
      dataType: 'json'
    });

    product
    .then(
      function(){
        returnValue.resolve(
          $.ajax({
            url: '/cart.js',
            type: 'GET',
            dataType: 'json'
          })
        );
      },
      function(jqXHR, textStatus, errorThrown){
        returnValue.resolve(jqXHR.responseJSON.description);
      }
    );

    $(button).attr('value', completedText).prop('disabled', false);
    return(returnValue);
  }
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
