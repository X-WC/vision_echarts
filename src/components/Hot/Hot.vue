<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont left_arrow" @click="changeLeftArrow" v-bind:style="comStyle">&#xe660;</span>
    <span class="iconfont right_arrow" @click="changeRightArrow" v-bind:style="comStyle">&#xe65f;</span>
    <div class="title" :style="comStyle">{{catName}}</div>
  </div>
</template>

<script>
export default {
  name: 'Hot',
  data () {
    return {
      chart: null,
      allData: null,
      currentIndex: 0, // 当前显示的一级分类数据类型
      titleFontSize: Number
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
  computed: {
    // 得到标题名称 名称依赖于 allData 所以使用计算属性
    catName () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    // 计算样式的字体大小
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    }
  },
  methods: {
    // 初始化图表
    initChart () {
      this.chart = this.$echarts.init(this.$refs.hot_ref, 'chalk')
      const initOption = {
        title: {
          text: '热销商品销售金额占比统计',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        // tooltip 工具提示
        tooltip: {
          show: true,
          formatter: (arg) => {
            // 计算总数
            let total = 0
            arg.data.children.forEach(item => {
              total += item.value
            })
            // 整理字符串
            let str = ''
            arg.data.children.forEach(item => {
              str += `
              ${item.name}:${parseInt(item.value / total * 100) + '%'}
              <br />
              `
            })
            return str
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            // 高亮情况下的文字
            emphasis: {
              label: {
                show: true
              }
            }
          }
        ]
      }
      this.chart.setOption(initOption)
    },
    // 获取数据
    async getData () {
      const { data: res } = await this.$http.get('hotproduct')
      this.allData = res
      console.log(this.allData)
      this.updateChart()
    },
    // 处理数据并更新图表
    updateChart () {
      // 定义图例的数组名称
      const legendArr = this.allData[this.currentIndex].children.map(item => {
        return item.name
      })
      const seriesArr = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      // console.log(seriesArr)
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: [
          {
            data: seriesArr
          }
        ]
      }
      this.chart.setOption(dataOption)
    },
    // 响应式图表
    screenAdapter () {
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%']
          }
        ],
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chart.setOption(adapterOption)
      this.chart.resize()
    },
    // 点击右箭头切换下一张图表
    changeRightArrow () {
      this.currentIndex++
      // console.log(this.currentIndex)
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    },
    // 点击左箭头切换上一张图表
    changeLeftArrow () {
      this.currentIndex--
      // console.log(this.currentIndex)
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    }
  }
}
</script>

<style lang="less" scoped>
.left_arrow,
.right_arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color:white;
  cursor: pointer;
}
.left_arrow {
  left: 10%;
}
.right_arrow {
  right: 10%;
}
.title{
  position: absolute;
  bottom: 5%;
  right: 5%;
  color: white;
}
</style>
