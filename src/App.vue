<template>
  <div id="app">
    <ChartCurve></ChartCurve>
  </div>
</template>

<script>
import ChartCurve from './components/chartcurve.vue';

export default {
  name: 'App',
  components: {
    ChartCurve
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  border: 0px;
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
}

html, body {
  border: 0px;
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
}
</style>
