<template>
  <div class="navbar-wrapper">
    <button class="nav-main-btn" type="button" name="button">
      <app-logo class="top-logo" v-bind:loading="false"></app-logo>
      <span class="nav-burger"><span></span></span>
    </button>
  </div>

</template>

<script type="text/javascript">
  import applogo from './applogo.vue'

  export default {
    replace: true,
    components: {'app-logo': applogo},
    methods: {

    },
    created: function () {

    },
    events: {

    },
    data () {
      return {
        // loading: false
      }
    }
  }

</script>

<style>
.navbar-wrapper {
  z-index: 999; padding: 0;
  width:auto; height: auto;
  position: fixed; top:0; left:0;
}
.nav-main-btn {position: absolute; top:10px; left: 15px; background: none; border:none; width:235px;height:95px; cursor: pointer; border-radius: 10px;}
.nav-main-btn:hover {box-shadow: 0 0 30px 0 #505050}
.top-logo {position: absolute; top:12px; left:17px; width:175px; height:75px;}
.nav-burger {position: absolute; top: 40px; left: 205px; width: 15px; height: 19px;}
.nav-burger span, .nav-burger span:before, .nav-burger span:after {
  display: block; content: '';
  position: absolute;left:0;
  height: 3px; width: 100%;
  background: #FFFFE9;
}
.nav-burger span:before {top: -8px;}
.nav-burger span:after {bottom: -8px;}

</style>
