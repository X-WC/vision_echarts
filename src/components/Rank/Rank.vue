<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
  name: 'Rank',
  data () {
    return {
      chart: null,
      allData: null,
      startValue: 0, // 区域缩放的起始值
      endValue: 9, // 区域缩放的结束值
      timeId: null // 定时器的标识
    }
  },
  // mounted DOM元素挂载时
  mounted () {
    this.initChart()
    this.getData()
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },
  // destoryed DOM元素销毁时
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timeId) // 停止定时器
  },
  methods: {
    // 初始化 echarts 实例对象
    initChart () {
      this.chart = this.$echarts.init(this.$refs.rank_ref, 'chalk')
      const initOption = {
        // 标题文字的设置
        title: {
          text: '地区销售排行',
          left: 20,
          top: 20
        },
        // 图表距离屏幕距离的设置 可改变图表的大小
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true // 距离是包含坐标轴的文字
        },
        // x轴的设置
        xAxis: {
          type: 'category'
        },
        // y轴的设置
        yAxis: {
          type: 'value'
        },
        // 工具栏的设置
        tooltip: {
          show: true
        },
        // 关于图表的参数设置
        series: [
          {
            type: 'bar',
            // 提示文字的显示设置
            label: {
              show: true,
              position: 'top',
              textStyle: {
                color: 'white'
              }
            },
            // 设置柱状图形的圆角以及颜色
            itemStyle: {
              // 指明颜色渐变的方法
              // 指明不同百分比之下的颜色的值
              color: arg => {
                if (arg.value > 300) {
                  return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#0ba82c'
                    }, {
                      offset: 1,
                      color: '#4ff778'
                    }
                  ])
                } else if (arg.value > 200) {
                  return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#2e72bf'
                    }, {
                      offset: 1,
                      color: '#23e5e5'
                    }
                  ])
                } else {
                  return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    // 百分之0状态下的颜色值
                    {
                      offset: 0,
                      color: '#5052EE'
                    },
                    // 百分之100状态下的颜色值
                    {
                      offset: 1,
                      color: '#AB6EE5'
                    }
                  ])
                }
              }
            }
          }
        ]
      }
      this.chart.setOption(initOption)
      // 监听鼠标移入图表事件
      this.chart.on('mouseover', () => {
        clearInterval(this.timeId) // 停止定时器
      })
      // 监听鼠标移出图表事件
      this.chart.on('mouseout', () => {
        this.startInterval() // 启动定时器
      })
    },
    // 获取数据
    async getData () {
      const { data: res } = await this.$http.get('rank')
      console.log(res)
      // 对现有数据进行排序
      this.allData = res.sort((a, b) => {
        return b.value - a.value
      })
      this.allData = res
      this.updateChart()
      // 开启定时器
      this.startInterval()
    },
    // 处理数据并更新图表
    updateChart () {
      // 处理数据
      const cityData = this.allData.map(item => {
        return item.name
      })
      // console.log(cityData)
      const valueData = this.allData.map(item => {
        return item.value
      })
      // 图表的数据设置
      const dataOption = {
        xAxis: {
          data: cityData
        },
        // 区域缩放的设置
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: valueData
          }
        ]
      }
      this.chart.setOption(dataOption)
    },
    // 响应式图表
    screenAdapter () {
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              // 指定圆角
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chart.setOption(adapterOption)
      this.chart.resize()
    },
    // 动态变化图表
    startInterval () {
      // 判断timeId是否存在 定时器是否已经开启
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      // 开启定时器
      this.timeId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        // 更新数据
        this.updateChart()
      }, 2000)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
