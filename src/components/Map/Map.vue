<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
export default {
  name: 'Map',
  data () {
    return {
      chart: null, // echarts实例对象
      cityData: null, // 获取到城市的数据
      mapData: null // 获取到的地图数据
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化图表
    initChart () {
      this.chart = this.$echarts.init(this.$refs.map_ref, 'chalk')
      const initOption = {
        geo: {
          type: 'map'
        }
      }
      this.chart.setOption(initOption)
    },
    // 获取数据
    async getData () {
      const { data: city } = await this.$http.get('map')
      // console.log(city)
      const { data: map } = await this.$http.get('map/china')
      // console.log(map)
      this.cityData = city
      this.mapData = map
      this.updateChart()
    },
    // 处理数据和更新图表
    updateChart () {
      // 注册地图矢量数据
      this.$echarts.registerMap('chinaMap', this.mapData)
      // 处理散点图数据
      const seriesArr = this.cityData.map(item => {
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo' // 指定相应的地理坐标系为geo
        }
      })
      console.log(seriesArr)
      const dataOption = {
        geo: {
          map: 'chinaMap'
        },
        series: seriesArr
      }
      this.chart.setOption(dataOption)
    },
    screenAdapter () {
      const adapterOption = {}
      this.chart.setOption(adapterOption)
      this.chart.resize()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
