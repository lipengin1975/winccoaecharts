<template>
  <div id="chartcurve"></div>
</template>

<script>
export default {
    name: 'ChartCurve',
    methods: {
      drawChart: function() {
        let myChart = this.$echarts.init(document.getElementById('chartcurve'), 'dark');
        let option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
        myChart.setOption(option);
      },
    },
    mounted() {
      this.drawChart();
      this.width = window.width;
      this.height = window.height; // 为啥还是多了几个像素？
    }
}
</script>

<style scoped>
#chartcurve {
    width: 100%;
    height: 100%;
}
</style>