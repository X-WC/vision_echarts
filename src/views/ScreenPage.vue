<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="">
      </div>
      <span class="logo">
        聪聪不是冲冲
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img class="theme-change" :src="themeSrc" alt="" @click="handleChangeTheme()">
        <span class="date">2021.11.9</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <!-- 销量趋势图 -->
          <trend ref="trend"></trend>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.trend ? 'icon-quxiaoquanping' : 'icon-quanping']" @click="changeSize('trend')"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
          <!-- 商家销售金额 -->
          <seller ref="seller"></seller>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.seller ? 'icon-quxiaoquanping' : 'icon-quanping']" @click="changeSize('seller')"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
       <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
          <!-- 商家分布 -->
          <Map ref="map"></Map>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.map ? 'icon-quxiaoquanping' : 'icon-quanping']" @click="changeSize('map')"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <!-- 地区销量展示 -->
          <rank ref="rank"></rank>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.rank ? 'icon-quxiaoquanping' : 'icon-quanping']" @click="changeSize('trend')"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
       <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比 -->
          <hot ref="hot"></hot>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.hot ? 'icon-quxiaoquanping' : 'icon-quanping']" @click="changeSize('hot')"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <!-- 库存销量分析 -->
          <stock ref="stock"></stock>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.stock ? 'icon-quxiaoquanping' : 'icon-quanping']" @click="changeSize('stock')"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils.js'
import Hot from '../components/Hot/Hot.vue'
import Map from '../components/Map/Map.vue'
import Rank from '../components/Rank/Rank.vue'
import Seller from '../components/Seller/Seller.vue'
import Stock from '../components/Stock/Stock.vue'
import Trend from '../components/Trend/Trend.vue'

export default {
  name: 'ScreenPage',
  data () {
    return {
      fullScreenStatus: {
        hot: false,
        map: false,
        rank: false,
        seller: false,
        stock: false,
        trend: false
      }
    }
  },
  created () {
    // 注册回调函数
    this.$socket.registerCallBack('fullScreen', this.recvData)
    this.$socket.registerCallBack('themeChange', this.recvThemeChange)
  },
  destroyed () {
    // 销毁回调函数
    this.$socket.unRegisterCallBack('fullScreen')
    this.$socket.unRegisterCallBack('themeChange')
  },
  computed: {
    headerSrc () {
      return '/static/img/' + getThemeValue(this.theme).headerBorderSrc
    },
    themeSrc () {
      return '/static/img/' + getThemeValue(this.theme).themeSrc
    },
    containerStyle () {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  methods: {
    changeSize (chartName) {
      // console.log(chartName)
      // 先将 fullScreenStatus 的值 取反
      // this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // 再调用每个组件的 screenAdapter 的方法
      // this.$nextTick(() => {
      //   this.$refs[chartName].screenAdapter()
      // })
      // 使用websocket实现联动效果
      const targetValue = !this.fullScreenStatus[chartName]
      this.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: chartName,
        value: targetValue
      })
    },
    recvData (data) {
      console.log(data)
      const chartName = data.chartName
      const targetValue = data.value
      this.fullScreenStatus[chartName] = targetValue
      // $nextTick() 方法调用 不错
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    // 改变主题
    handleChangeTheme () {
      this.$socket.send({
        action: 'themeChange',
        socketType: 'themeChange',
        chartName: '',
        value: ''
      })
    },
    recvThemeChange () {
      // 修改vuex的数据
      this.$store.commit('changeTheme')
    }
  },
  components: {
    Trend,
    Seller,
    Map,
    Hot,
    Rank,
    Stock
  }
}
</script>

<style lang="less" scoped>
.fullscreen {
  position: fixed!important;
  top: 0!important;
  left: 0!important;
  width: 100%!important;
  height: 100%!important;
  z-index: 100!important;
}
.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: white;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .logo {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-80%);
    img {
      width: 5rem;
      height: 3rem;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 0;
    font-size: 20px;
    transform: translate(-50%,50%);
  }
  .title-right {
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
    .theme-change {
    width: 28px;
    height: 21px;
    cursor: pointer;
    }
    .date {
      font-size: 15px;
      margin-left: 10px;
    }
  }
}
.screen-body{
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
      // border: 1px solid red;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
      // border: 1px solid red;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin: 0 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
      // border: 1px solid red;
    }
    #middle-bottom {
      height: 28%;
      margin-top: 25px;
      position: relative;
      // border: 1px solid red;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
      // border: 1px solid red;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
      // border: 1px solid red;
    }
  }
}
.resize {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  .iconfont {
    font-size: 25px;
  }
}
</style>
