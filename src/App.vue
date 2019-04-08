<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  .size {
    width: 100%;
    height: 100%;
  }

  html,
  body {
    .size;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  #app {
    .size;
  }
</style>

<style>
  @import 'http://at.alicdn.com/t/font_782428_r5khdnn8177.css';
</style>
