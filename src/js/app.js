// REQUIRE ALL SCSS FROM APP.SCSS
require("./../scss/app.scss");

const AjaxCart = {
  settings: {},
  init() {
    console.log('AjaxCart loaded');
  },
  called() {
    console.log("CALLED");
  }
};

window.AjaxCart = AjaxCart;

$(function() {
  AjaxCart.init();
});
