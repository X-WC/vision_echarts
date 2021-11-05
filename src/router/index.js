import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入 SellerPage 商家销售统计
import SellerPage from '@/views/Seller/SellerPage.vue'
// 导入 TrendPage 销量趋势图表
import TrendPage from '@/views/Trend/TrendPage.vue'
// 导入 MapPage 商家分布模块
import MapPage from '@/views/Map/MapPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    component: SellerPage
  }, {
    path: '/trendpage',
    component: TrendPage
  }, {
    path: '/mappage',
    component: MapPage
  }
]

const router = new VueRouter({
  routes
})

export default router
