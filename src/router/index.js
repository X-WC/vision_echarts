import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入 SellerPage 商家销售统计
import SellerPage from '@/views/Seller/SellerPage.vue'
// 导入 TrendPage 销量趋势图表
import TrendPage from '@/views/Trend/TrendPage.vue'
// 导入 MapPage 商家分布模块
import MapPage from '@/views/Map/MapPage.vue'
// 导入 RankPage 销量排行模块
import RankPage from '@/views/Rank/RankPage.vue'
// 导入 HotProductPage 热销商品占比模块
import HotProductPage from '@/views/HotProduct/HotProductPage.vue'
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
  }, {
    path: '/rankpage',
    component: RankPage
  }, {
    path: '/hotproductpage',
    component: HotProductPage
  }
]

const router = new VueRouter({
  routes
})

export default router
