<template>
  <div class="cosmos-main">
  </div>

</template>

<script type="text/javascript">
  import Cosmos from './cosmosRendering.js'

  export default {
    // replace: false,
    components: {},
    ready: function () {
        this.myCosmos = new Cosmos('.cosmos-main')
        this.myCosmos.init()
    },
    data () {
      return {
          myCosmos: {}
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
