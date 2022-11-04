Vue.component("products", {
  data() {
    return {
      products: [],
    };
  },
  mounted() {
    this.$parent.getJson(`/api/products`).then((data) => {
      for (let item of data) {
        this.$data.products.push(item);
      }
    });
  },
  template: `
    <div class="featuredItems">
        <product v-for="item of products"
        :key="item.id_product"
        :product="item"
        @add-product="$parent.$refs.cart.addProduct"></product>
    </div>
    `,
});
Vue.component("product", {
  props: ["product"],
  template: `
    <div class="featuredItem">
                    <div class="featuredImgWrap">
                        <img :src="product.img" alt="">
                        <div class="featuredImgDark">
                            <button class="button_add_to_cart" 
                                @click="$emit('add-product', product)">
                                    <img src="images/cart.svg" alt="">
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    <div class="featuredData">
                        <div class="featuredName">
                            {{product.product_name}}
                        </div>
                        <div class="featuredText">
                            Known for her sculptural takes on traditional 
                            tailoring, Australian arbiter of cool Kym
                            Ellery
                            teams
                            up with Moda Operandi.
                        </div>
                        <div class="featuredPrice">
                            {{product.price}}
                        </div>
                    </div>
                </div>
    `,
});
