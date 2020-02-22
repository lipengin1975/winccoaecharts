<template>
  <div id="chartcurve"></div>
</template>

<script>
import * as EChartsOption from '../lib/echartsopt';
// ECharts对象
let myChart = undefined;

export default {
  name: 'ChartCurve',
  methods: {
    drawChart: function (option) {
      myChart = this.$echarts.init(document.getElementById('chartcurve'), 'dark');
      myChart.setOption(option);
    },
  },
  mounted() {
    this.width = window.width;
    this.height = window.height; // 为啥还是多了几个像素？

    EChartsOption.getOption(undefined, option => {
      this.drawChart(option);
    });
  }
}

/**
 * 设置数据用于图表显示
 * @param {Object} params 数据对象
 * @prop {string} [params.title] 曲线标题
 * @prop {bool} [params.dataZoom] 显示缩放组件
 * @prop {bool} [params.toolbox] 显示工具栏
 * @prop {Array} [params.data] 数据
 */
window.setData = function setData(params) {
  EChartsOption.getOption(params, option => {
    myChart.setOption(option);
  })
}
</script>

<style scoped>
#chartcurve {
  width: 100%;
  height: 100%;
}
</style>