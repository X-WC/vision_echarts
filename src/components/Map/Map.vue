<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import { getProvinceMapInfo } from '@/utils/map_utils.js'
import { mapState } from 'vuex'
export default {
  name: 'Map',
  data () {
    return {
      chart: null, // echarts实例对象
      allData: null, // 获取到散点数据
      mapData: null, // 获取到的地图数据
      cityData: {} // 获取的省份地图矢量数据
    }
  },
  created () {
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('mapData')
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      this.chart.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  },
  methods: {
    // 初始化图表
    initChart () {
      this.chart = this.$echarts.init(this.$refs.map_ref, this.theme)
      const initOption = {
        title: {
          text: '商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          label: {
            show: true, // 2.展示标签
            color: 'white'
          },
          // 控制地图的大小位置
          top: '5%',
          bottom: '5%',
          // 控制地图的颜色
          itemStyle: {
            areaColor: '#2e72bf',
            borderColor: '#333'
          }
        },
        legend: {
          orient: 'vertical',
          bottom: '20',
          left: '20'
        }
      }
      this.chart.setOption(initOption)
      // 监听地图点击事件
      this.chart.on('click', async arg => {
        // 获取城市地图数据
        const provinceInfo = getProvinceMapInfo(arg.name)
        console.log(this.cityData[provinceInfo.key])
        if (!this.cityData[provinceInfo.key]) {
          const { data: city } = await this.$http.get(provinceInfo.path)
          console.log(city)
          this.cityData[provinceInfo.key] = city
          // 注册地图矢量数据
          this.$echarts.registerMap(provinceInfo.key, city)
        }
        // console.log(city)
        const cityOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chart.setOption(cityOption)
      })
    },
    // 获取数据
    async getData () {
      // 获取散点图数据
      const { data: res } = await this.$http.get('map')
      // console.log(res)
      // 获取地图数据
      const { data: map } = await this.$http.get('map/china')
      // console.log(map)
      this.allData = res
      this.mapData = map
      this.updateChart()
    },
    // 处理数据和更新图表
    updateChart () {
      // 注册地图矢量数据
      this.$echarts.registerMap('chinaMap', this.mapData)
      // 图例的数据
      const legendArr = this.allData.map(item => {
        return item.name
      })
      console.log(legendArr)
      // 处理散点图数据
      const seriesArr = this.allData.map(item => {
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            // 改变涟漪效果
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo' // 指定相应的地理坐标系为geo
        }
      })
      // console.log(seriesArr)
      // 图表数据
      const dataOption = {
        geo: {
          map: 'chinaMap'
        },
        series: seriesArr,
        legend: {
          data: legendArr
        }
      }
      this.chart.setOption(dataOption)
    },
    // 响应式图表
    screenAdapter () {
      const titileFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titileFontSize
          }
        },
        legend: {
          itemWidth: titileFontSize / 2,
          itemHeight: titileFontSize / 2,
          itemGap: titileFontSize / 2,
          textStyle: {
            fontSize: titileFontSize / 2
          }
        }
      }
      this.chart.setOption(adapterOption)
      this.chart.resize()
    },
    // 还原地图
    revertMap () {
      const revertOption = {
        geo: {
          map: 'chinaMap'
        }
      }
      this.chart.setOption(revertOption)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
