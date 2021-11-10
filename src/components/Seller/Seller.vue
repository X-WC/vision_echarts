<!-- 最终呈现在整个页面上的图表 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Seller',
  data () {
    return {
      // echarts 对象
      chart: null,
      // 商家信息
      allData: null,
      // 显示的当前页
      currentPage: 1,
      // 显示数据的总页数
      totalPage: 0,
      // 定时器的标识
      timeId: null
    }
  },
  created () {
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  // 钩子函数 mounted
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候 主动进行屏幕的适配
    this.screenAdapter()
  },
  // destoryed 销毁
  destroyed () {
    clearInterval(this.timeId)
    // 在组件销毁时 取消事件监听器 以免内存泄漏
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('sellerData')
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
    // 初始化 echartInstance 对象
    initChart () {
      // 根据 ref 获取 dom 元素
      this.chart = this.$echarts.init(this.$refs.seller_ref, this.theme)
      // 对图表初始化配置的控制
      const initOption = {
        // 设置图表标题
        title: {
          text: '商家销售统计',
          left: 20,
          top: 20
        },
        // 调整图表的大小
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 距离是包含坐标轴的文字
        },
        yAxis: {
          type: 'category'
        },
        xAxis: {
          type: 'value'
        },
        // 工具栏的设置
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            // 设置柱状图形上的文字样式
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            // 设置柱状图形的圆角以及颜色
            itemStyle: {
              // 指明颜色渐变的方法
              // 指明不同百分比之下的颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
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
        ]
      }
      this.chart.setOption(initOption)
      // 监听鼠标移入事件 如果鼠标进入图表 则停止定时器
      this.chart.on('mouseover', () => {
        clearInterval(this.timeId)
      })
      // 如果鼠标移出图表 则重新开启定时器
      this.chart.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器的数据
    getData (res) {
      // 请求数据的地址 http://127.0.0.1:8888/api/seller
      // const { data: res } = await this.$http.get('seller')
      // 将数据进行整合为两个数组
      // res.forEach(element => {
      //   // 商家名称信息
      //   this.businessName.push(element.name)
      //   // 商家销量信息
      //   this.businessValue.push(element.value)
      // })
      // 实现动态刷新效果
      // 1.对现有数据进行排序 Array.prototype.sort()
      this.allData = res.sort((a, b) => {
        return a.value - b.value // 从小到大排序
      })
      // console.log(this.allData.length)
      // 2.每5个数据显示一页
      // 总页数
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1
      // console.log(this.totalPage)
      // 更新图表
      this.updateChart()
      // 启动定时器
      this.startInterval()
    },
    // 更新图表
    updateChart () {
      // 当前页显示的数据 Array.prototype.slice(start, end)
      // 开始
      const start = (this.currentPage - 1) * 5
      // 结束
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      // 将数据整合为两个数组 采用map方法
      const sellerName = showData.map((item) => item.name)
      // console.log(sellerName)
      const sellerValue = showData.map((item) => item.value)
      // console.log(sellerValue)
      // 设置数据配置
      const dataOption = {
        yAxis: {
          data: sellerName
        },
        series: [
          {
            data: sellerValue
          }
        ]
      }
      this.chart.setOption(dataOption)
    },
    // 刷新图表
    startInterval () {
      // 启动定时器时 先判断一下有没有 timeId 定时器 如果没有 再启动定时器
      // 如果不做此操作 则会出现快速刷新图表的bug
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      // 设置定时器
      this.timeId = setInterval(() => {
        // 当前页码经过三秒后自增加1
        this.currentPage++
        // 如果当前页码数已经超过总页码数 则重新设置当前页码数
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        // 更新数据
        this.updateChart()
      }, 3000)
    },
    screenAdapter () {
      // 获取 dom 元素的宽度
      // console.log(this.$refs.seller_ref.offsetWidth)
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      // 设置分辨率适配
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        // 工具栏的设置
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            // 设置柱状图形的宽度
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chart.setOption(adapterOption)
      // 调用图表对象的 resize 方法产生适配
      this.chart.resize()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
