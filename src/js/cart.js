import $ from 'jquery';

export default function () {

  function variantAvailable(productId, variantId, quantity, element) {
    var variantAvailableQuantity = $('#product-select').find('option[value=' + variantId + ']').data('available-quantity');
    var error = '';
    var fullTitle = $('.js-variant-title').attr('value');
    if ( variantAvailableQuantity < 0 ) {
      error = 'No additional ' + fullTitle + ' in stock.';
    } else if (quantity > variantAvailableQuantity) {
      error = 'No additional ' + fullTitle + ' in stock.';
    } else if (variantAvailableQuantity >= quantity)  {
      changeQuantity(variantId, quantity, element);
    }

    if (error != '') {
      $(element).closest('.cart-item-detail').find('.js-cart-error').text(error).addClass('visible');
      setTimeout(function(){
        $(element).closest('.cart-item-detail').find('.js-cart-error').removeClass('visible').text('');
      }, 5000);
    }
  }

  function changeQuantity(variantId, itemQuantity, element) {
    var updateHash = `{"updates": {"${variantId}": ${itemQuantity}}}`;
    updateHash = JSON.parse(updateHash);
    $.ajax({
      url: '/cart/update.js',
      type: 'POST',
      dataType: 'json',
      data: updateHash
    })
    .done(function(data) {
      var itemCount = data.item_count;
      var cartTotal = '$' + (data.total_price / 100).toString() + '.00';
      $('.cart-count').text(itemCount);
      $('.cart-total-info').find('.js-price').text(cartTotal);
      $(element).closest('.cart-item-detail').find('.quantity h4').text(itemQuantity);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      var error = jqXHR.responseJSON.description;
      $(element).closest('.cart-item-detail').find('.js-cart-error').text(error).addClass('visible');
      setTimeout(function(){
        $(element).closest('.cart-item-detail').find('.js-cart-error').removeClass('visible').text('');
      }, 5000);
    });
  }

  function updateQuantity() {
    $('.subtract, .increase').click(function(){
      var action = $(this).data('action');
      var quantity = $(this).closest('.cart-item-detail').find('.quantity h4').text();
      var variantId = $(this).closest('.cart-item').find('.item-variant-id').val();
      var productId = $(this).closest('.cart-item').find('.item-product-id').val();

      if ( (quantity == 1) && (action == 'subtract') ) {
        // Remove line item
        removeCartItem(variantId);
        $(this).closest('.cart-item').remove();

      } else if ( (quantity > 1) && (action == 'subtract') ) {
        // Remove 1 quantity
        quantity--;
        changeQuantity(variantId, quantity, $(this));

      } else if ( (action == 'increase')  ) {
        // Increase 1 quantity
        quantity++;
        variantAvailable(productId, variantId, quantity, $(this))
      }
    });
  }

  addToCart();
  updateQuantity();
}
