<!-- 针对于 /sellerpage 这条路径显示出来的 在这个组件中 通过子组件注册的方式 显示出Seller.vue这个组件 -->
<template>
  <div class="com-page">
    <seller></seller>
  </div>
</template>

<script>
import Seller from '@/components/Seller/Seller.vue'
export default {
  name: 'SellerPage',
  data () {
    return {}
  },
  methods: {},
  components: {
    Seller
  }
}
</script>

<style lang="less" scoped>
</style>
