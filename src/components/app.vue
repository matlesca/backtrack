<template>
    <div class="main-wrapper">
        <!-- DEEZER root info place -->
        <div id="dz-root"></div>

        <router-view></router-view>

    </div>

</template>

<script>
import store from '../vuex/store'
import {initApp, initPlayer} from '../vuex/dz_actions'

export default {
    replace: false,
    store,
    vuex: {
        actions: {initApp, initPlayer}
    },
    ready: function () {
        this.initApp()
    }
}

</script>

<style>
.main-wrapper {
    position: absolute; top:0; left: 0;
    margin:0; padding:0; width: 100%; height:100%;
    overflow: hidden;
    /*padding-top: 90px;*/
    background: #282828;
}


</style>
