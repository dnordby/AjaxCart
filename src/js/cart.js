import $ from 'jquery';

export default function () {
  function addCartItem(cart) {
    $('.cart-drawer-body').html('');
    var line_items = cart.items;
    if (line_items.length > 0) {
      for (var i = line_items.length - 1; i >= 0; i--) {
        var imgUrl = line_items[i].image;
        var itemTitle = line_items[i].title;
        var itemPrice = line_items[i].price;
        var itemQuantity = line_items[i].quantity;
        var variantId = line_items[i].variant_id;
        var productId = line_items[i].product_id;
        itemPrice = '$' + (line_items[i].price / 100).toString() + '.00';

        var html_text = `<div class="cart-item">
                          <input type="hidden" value="${variantId}" class="item-variant-id">
                          <input type="hidden" value="${productId}" class="item-product-id">
                          <div class="cart-item-image img-3-4">
                            <img src=${imgUrl}>
                          </div>
                          <div class="cart-item-detail">
                            <h4>${itemTitle}</h4>
                            <p>${itemPrice}</p>

                            <div class="subtract" data-action="subtract">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="1" viewBox="0 0 14 1">
                                <g fill="none" fill-rule="evenodd" transform="translate(-5 -11)">
                                  <rect width="24" height="24" fill="none"/>
                                  <path stroke="#4A4A4A" stroke-linecap="round" stroke-opacity=".9" d="M18,11.5 L6,11.5"/>
                                </g>
                              </svg>
                            </div>

                            <div class="quantity"><h4>${itemQuantity}</h4></div>

                            <div class="increase" data-action="increase">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                                <g fill="none" fill-rule="evenodd" transform="translate(-5 -5)">
                                  <rect width="24" height="24" fill="none"/>
                                  <path stroke="#4A4A4A" stroke-linecap="round" stroke-opacity=".9" d="M18 11.5L6 11.5M11.5 18L11.5 6"/>
                                </g>
                              </svg>
                            </div>
                            <p class="caption cart-error js-cart-error"></p>
                          </div>
                        </div>`;
        $('.cart-drawer-body').prepend(html_text);
      }

      $('.cart-icon').trigger('click');
    }
    updateQuantity();
  }

  function removeCartItem(itemId) {
    var variantId = parseInt(itemId);
    var updateHash = {quantity: 0, id: variantId};

    $.ajax({
      url: '/cart/change.js',
      type: 'POST',
      dataType: 'json',
      data: updateHash,
    })
    .done(function(data) {
      var cartTotal = '$' + (data.total_price / 100).toString() + '.00';
      var cartCount = $('.cart-count').text();
      var itemCount = 0;
      if (cartCount == '1') {
        itemCount = '';
      } else {
        var intParse = parseInt(cartCount);
        itemCount = intParse - 1;
      }
      $('.cart-count').text(itemCount);
      $('.js-price').text(cartTotal);
    })
    .always(function(data){
      if (data.item_count == 0) {
        var emptyText = `<div class="cart-item no-items">
                          <h4>No items in your cart...yet!</h4>
                        </div>`;
        $('.cart-drawer-body').prepend(emptyText);
        $('.checkout').prop('disabled', true);
      }
    });
  }

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

  function getCart() {
    $.ajax({
      url: '/cart.js',
      type: 'GET',
      dataType: 'json'
    })
    .done(function() {
    })
    .fail(function() {
    })
    .always(function(data) {
      addCartItem(data);
    });
  }

  function addToCart() {
    $('.addToCart').click(function(e){
      e.preventDefault();
      var form = $(this).closest('.product-row').serialize();
      var completedText = $(this).attr('value');
      var cartError = false;
      $(this).attr('value', 'adding...').prop('disabled', true);
      $.ajax({
        url: '/cart/add.js',
        type: 'POST',
        data: form,
        dataType: 'json'
      })
      .done(function(data) {
        var cartCount = $('.cart-count').text();
        var itemCount = 0;
        if (cartCount == '') {
          itemCount = data.quantity;
          $('.checkout').prop('disabled', false);
        } else {
          var intParse = parseInt(cartCount);
          itemCount = intParse + 1;
        }
        $('.cart-count').text(itemCount);

        var current_price = Number($('.js-price').text().replace(/[^0-9\.-]+/g,"")) * 100;
        var update_price = data.price + current_price;
        update_price = '$' + (update_price / 100).toString() + '.00';
        console.log(update_price);
        $('.cart-total-info').find('.js-price').text(update_price);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        var error = '';
        error = jqXHR.responseJSON.description;
        $('.js-add-cart-error').text(error).addClass('visible');
        setTimeout(function(){
          $('.js-add-cart-error').removeClass('visible').text('');
        }, 5000);
        cartError = true;
      })
      .always(function(data){
        if (!cartError) {
          getCart();
        }
        $('.addToCart').attr('value', completedText).prop('disabled', false);
      });
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
