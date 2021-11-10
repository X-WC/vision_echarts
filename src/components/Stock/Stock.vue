<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Stock',
  data () {
    return {
      chart: null,
      allData: null,
      currentIndex: 0, // 当前显示的数据
      timeId: null
    }
  },
  created () {
    this.$socket.registerCallBack('stockData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timeId)
    this.$socket.unRegisterCallBack('stockData')
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
    initChart () {
      this.chart = this.$echarts.init(this.$refs.stock_ref, this.theme)
      const initOption = {
        title: {
          text: '库存和销量分析',
          top: 20,
          left: 20
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            console.log(arg)
          }
        }
      }
      this.chart.setOption(initOption)
      // 鼠标移入停止定时器
      this.chart.on('mouseover', () => {
        clearInterval(this.timeId)
      })
      // 鼠标移出启动定时器
      this.chart.on('mouseout', () => {
        this.startInterval()
      })
    },
    getData (res) {
      // const { data: res } = await this.$http.get('stock')
      this.allData = res
      // console.log(this.allData)
      this.updateChart()
      // 开启定时器
      this.startInterval()
    },
    updateChart () {
      // 圆环中心点的位置
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      // 设置圆环的渐变色
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      // 处理数据
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      // 一共10个数据 分成两页进行显示
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          // 设置每个圆环的中心点
          center: centerArr[index],
          label: {
            position: 'center',
            color: colorArr[index][0]
          },
          data: [
            {
              name: item.name + '\n\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              },
              tooltip: {
                formatter: `${item.name}<br/>销量:{c}<br />占比:{d}%`
              }
            }, {
              value: item.stock,
              itemStyle: {
                color: '#333843'
              },
              tooltip: {
                formatter: `${item.name}<br/>库存:{c}<br />占比:{d}%`
              }
            }
          ],
          // 移除指示线
          labelLine: {
            show: false
          },
          // 关闭鼠标移入时的动画效果
          hoverAnimation: false
        }
      })
      const updateOption = {
        series: seriesArr
      }
      this.chart.setOption(updateOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
      const innerRadius = titleFontSize * 2.8
      const outterRadius = innerRadius * 1.125
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }, {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }, {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }, {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }, {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }
        ]
      }
      this.chart.setOption(adapterOption)
      this.chart.resize()
    },
    // 动态变化
    startInterval () {
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        // 更新数据
        this.updateChart()
      }, 5000)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
