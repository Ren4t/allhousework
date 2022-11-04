Vue.component("cart", {
  data() {
    return {
      cartUrl: "/getBasket.json",
      cartItems: [],
      showCart: false,
      totalQuantity: 0,
    };
  },
  mounted() {
    this.$parent.getJson(`/api/cart`).then((data) => {
      for (let item of data.contents) {
        this.$data.cartItems.push(item);
        this.$data.totalQuantity += item.quantity;
      }
    });
  },
  methods: {
    addProduct(item) {
      let find = this.cartItems.find((el) => el.id_product === item.id_product);
      if (find) {
        this.$parent
          .putJson(`/api/cart/${find.id_product}`, { quantity: 1 })
          .then((data) => {
            if (data.result === 1) {
              find.quantity++;
              this.$data.totalQuantity++;
            }
          });
      } else {
        const prod = Object.assign({ quantity: 1 }, item);
        this.$parent.postJson(`/api/cart`, prod).then((data) => {
          if (data.result === 1) {
            this.cartItems.push(prod);
            this.$data.totalQuantity++;
          }
        });
      }
    },
    remove(item) {
      let find = this.cartItems.find((el) => el.id_product === item.id_product);
      if (find) {
        this.$parent
          .deleteJson(`/api/cart/deleteProduct/${find.id_product}`, {
            quantity: 1,
          })
          .then((data) => {
            if (data.result === 1) {
              if (find.quantity > 1) {
                find.quantity--;
                this.$data.totalQuantity--;
              } else {
                this.cartItems.splice(this.cartItems.indexOf(item), 1);
                this.$data.totalQuantity--;
              }
            }
          });
      }
    },
  },
  template: `
          <span class="cartIconWrap" >
               <img class="cartIcon" src="images/cart.png" alt="" @click="showCart = !showCart">
                <span class="counter_products">{{totalQuantity}}</span>
                <div class="cart-block" v-show="showCart">
                  <cart-item v-for="item of cartItems" :key="item.id_product" :cart-item="item" @remove="remove">
                  </cart-item>
                </div>
          </span>   
  `,
});

Vue.component("cart-item", {
  props: ["cartItem"],
  template: `
  <div class="cart-item">
                  <div class="product-bio">
                      <img :src="cartItem.img" alt="Some img">
                      <div class="product-desc">
                          <div class="product-title">{{ cartItem.product_name }}</div>
                          <div class="product-quantity">Quantity: {{ cartItem.quantity }}</div>
                          <div class="product-single-price">$ {{ cartItem.price }} each</div>
                      </div>
                  </div>
                  <div class="right-block-cart">
                      <div class="product-price">{{cartItem.quantity*cartItem.price}}</div>
                      <button class="del-btn" @click="$emit('remove', cartItem)">&times;</button>
                  </div>
              </div>
  `,
});
