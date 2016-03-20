<template>
  <div class="cosmos-main">
  </div>

</template>

<script type="text/javascript">
  import cRend from './cosmosRendering.js'

  export default {
    // replace: false,
    components: {},
    methods: {
      cubeExample: cRend.cubeExample,
      starsExample: cRend.starsExample
    },
    ready: function () {
      this.starsExample()
    },
    data () {
      return {

      }
    }
  }

</script>

<style>
  .cosmos-main {
    width: 100%; height: 100%;
    overflow: hidden;
  }
</style>
