<template>
  <div class="navbar-wrapper">
    <a class="nav-main-btn" type="button" v-on:click.prevent="toggleAppLoading()">
      <app-logo class="top-logo" size="small"></app-logo>
      <span class="nav-burger"><span></span></span>
    </a>
  </div>

</template>

<script type="text/javascript">
  import applogo from './applogo.vue'
  import {toggleAppLoading} from '../vuex/ui_actions'

  export default {
    replace: true,
    components: {'app-logo': applogo},
    vuex: {
        actions: {toggleAppLoading}
    }
  }

</script>

<style>
.navbar-wrapper {
  z-index: 999; padding: 0;
  width:auto; height: auto;
  position: fixed; top:0; left:0;
}
.nav-main-btn {position: absolute; top:10px; left: 15px; background: none; border:none; width:245px;height:95px; cursor: pointer; border-radius: 10px;}
.nav-main-btn:hover {box-shadow: 0 0 30px 0 #505050}
.nav-main-btn:disabled {box-shadow: none;cursor: default; pointer-events: none;}
.top-logo {position: absolute; top:12px; left:17px;}
.nav-burger {position: absolute; top: 40px; left: 215px; width: 15px; height: 19px;}
.nav-burger span, .nav-burger span:before, .nav-burger span:after {
  display: block; content: '';
  position: absolute;left:0;
  height: 3px; width: 100%;
  background: #FFFFE9;
}
.nav-burger span:before {top: -8px;}
.nav-burger span:after {bottom: -8px;}

</style>
