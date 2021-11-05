<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ showTitle }}</span>
      <span class="iconfont icon-xiajiantou title-icon" :style="comStyle" @click="showChoice = !showChoice"></span>
      <div class="select-con" v-show="showChoice">
        <div class="select-item" v-for="item in selectTypes" v-bind:key="item.key" @click="handleSelect(item.key)">{{item.text}}</div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  name: 'Trend',
  data () {
    return {
      chart: null,
      allData: null, // 获取到的全部数据
      showChoice: false, // 是否显示可选项
      choiceType: 'map', // 显示的数据类型
      titileFontSize: 0 // 设置标题的字体大小
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候 主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  computed: {
    // 选定类型
    selectTypes () {
      if (!this.allData) {
        return []
      } else {
        // 筛选出不同名的下拉项
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    // 展示标题
    showTitle () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    // 设置给标题的样式
    comStyle () {
      return {
        fontSize: this.titileFontSize + 'px'
      }
    }
  },
  methods: {
    // 初始化图表对象
    initChart () {
      this.chart = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      // 设置图表初始化配置
      const initOption = {
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        legend: {
          top: '11%',
          left: '20',
          icon: 'circle'
        },
        // 控制提示框文字怎么显示
        tooltip: {
          trigger: 'axis'
        },
        // 控制图表的大小
        grid: {
          top: '20%',
          left: '20',
          right: '3%',
          bottom: '3%',
          containLabel: true // 距离是包含坐标轴的文字
        }
      }
      this.chart.setOption(initOption)
    },
    // 获取数据
    async getData () {
      const { data: res } = await this.$http.get('trend')
      this.allData = res
      this.typeArr = this.allData.type
      // 更新图表
      this.updateChart()
    },
    // 处理数据更新图表
    updateChart () {
      // 半透明的颜色值
      const colorArr1 = ['rgba(11, 168, 44, 0.5)', 'rgba(44, 110, 255, 0.5)', 'rgba(22, 242, 217, 0.5)', 'rgba(254, 33, 30, 0.5)', 'rgba(250, 105, 0, 0.5)']
      // 全透明的颜色值
      const colorArr2 = ['rgba(11, 168, 44, 0)', 'rgba(44, 110, 255, 0)', 'rgba(22, 242, 217, 0)', 'rgba(254, 33, 30, 0)', 'rgba(250, 105, 0, 0)']
      // 处理数据
      // 类目轴的数据
      const timeArr = this.allData.common.month
      // y轴上的数据 series下的数据
      const valueArr = this.allData[this.choiceType].data
      // 图例数据
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              }, {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      // 设置图表数据配置
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chart.setOption(dataOption)
    },
    // 设置自适应屏幕
    screenAdapter () {
      // 计算标题文字大小
      this.titileFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      // 根据屏幕宽度设置文字/图表大小
      const adapterOption = {
        legend: {
          itemWidth: this.titileFontSize,
          itemHeight: this.titileFontSize,
          itemGap: this.titileFontSize,
          textStyle: {
            fontSize: this.titileFontSize / 2
          }
        }
      }
      this.chart.setOption(adapterOption)
      // 手动调用 resize 让图表进行适配
      this.chart.resize()
    },
    // 显示/隐藏下拉框
    handleSelect (currentType) {
      this.choiceType = currentType
      this.updateChart()
      this.showChoice = !this.showChoice
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-con {
    background: #222733;
  }
}
</style>
