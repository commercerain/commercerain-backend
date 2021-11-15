/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, Backbone) {
  var cartCount = 0;
  var isOpen = false;
  var isOutsideHorizontal = false;
  Drupal.commerceCart.CartBlockView = Backbone.View.extend({
    initialize: function initialize() {
      this.listenTo(this.model, 'cartsLoaded', this.render);
    },


    events: {
      'click .cart-block--cart-table__remove button': 'removeItem',
      'click .cart-block--link__expand': 'expandContents'
    },
    removeItem: function removeItem(e) {
      var target = JSON.parse(e.target.value);
      var endpoint = Drupal.url('cart/' + target[0] + '/items/' + target[1] + '?_format=json');
      fetch(endpoint, {
        credentials: 'include',
        method: 'delete'
      }).then(function (res) {}).then(function () {
        return Drupal.commerceCart.fetchCarts();
      });
    },
    expandContents: function expandContents(e) {
      e.preventDefault();
      if (cartCount > 0) {
        var $cart = $('.cart--cart-block');
        var $cartContents = $cart.find('.cart-block--contents');

        var windowWidth = $(window).width();
        var cartWidth = $cartContents.width() + $cart.offset().left;

        isOutsideHorizontal = cartWidth > windowWidth;
        if (isOutsideHorizontal) {
          $cartContents.addClass('is-outside-horizontal');
        }

        $cartContents.toggleClass('cart-block--contents__expanded').slideToggle();
        isOpen = !isOpen;
      }
    },
    render: function render() {
      cartCount = this.model.getCount();
      var template = Drupal.commerceCart.getTemplate({
        id: 'commerce_cart_js_block',
        data: '<div class="cart--cart-block">\n' + '  <div class="cart-block--summary">\n' + '    <a class="cart-block--link__expand" href="<%= url %>">\n' + '      <span class="cart-block--summary__icon" />\n' + '      <span class="cart-block--summary__count"><%= count_text %></span>\n' + '    </a>\n' + '  </div>\n' + '<% if (count > 0) { %>' + '  <div class="cart-block--contents">\n' + '    <div class="cart-block--contents__inner">\n' + '      <div class="cart-block--contents__items">\n' + '      </div>\n' + '      <div class="cart-block--contents__links">\n' + '        <%= links %>\n' + '      </div>\n' + '    </div>\n' + '  </div>' + '<% } %>' + '</div>\n'
      });

      this.$el.html(template.render({
        url: this.model.getUrl(),
        icon: this.model.getIcon(),
        count: this.model.getCount(),
        count_text: Drupal.formatPlural(this.model.getCount(), this.model.getCountSingular(), this.model.getCountPlural()),
        links: this.model.getLinks(),
        carts: this.model.getCarts()
      }));

      if (isOpen) {
        this.$el.find('.cart-block--contents').addClass('cart-block--contents__expanded').addClass('is-outside-horizontal', isOutsideHorizontal).show();
      }

      var icon = new Drupal.commerceCart.CartIconView({
        el: this.$el.find('.cart-block--summary__icon'),
        model: this.model
      });
      icon.render();
      var contents = new Drupal.commerceCart.CartContentsView({
        el: this.$el.find('.cart-block--contents__items'),
        model: this.model
      });
      contents.render();

      Drupal.attachBehaviors();
    }
  });
})(jQuery, Drupal, Backbone);